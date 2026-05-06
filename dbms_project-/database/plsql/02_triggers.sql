-- ============================================================================
-- STAGE 2: PL/SQL TRIGGERS (10+)
-- Automatic Business Logic Enforcement
-- ============================================================================

-- ============================================================================
-- TRIGGER 1: Validate Enrollment (BEFORE INSERT)
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_validate_enrollment
BEFORE INSERT ON BENEFICIARY_ENROLLMENT
FOR EACH ROW
DECLARE
    v_is_eligible VARCHAR2(1);
BEGIN
    -- Check if beneficiary is eligible for this scheme
    SELECT is_eligible INTO v_is_eligible
    FROM ELIGIBILITY_MATCH
    WHERE beneficiary_id = :NEW.beneficiary_id 
    AND scheme_id = :NEW.scheme_id;
    
    IF v_is_eligible = 'N' THEN
        RAISE_APPLICATION_ERROR(-20001, 
            'Beneficiary is not eligible for this scheme');
    END IF;
    
    -- Set enrollment date if not provided
    IF :NEW.enrollment_date IS NULL THEN
        :NEW.enrollment_date := SYSDATE;
    END IF;
    
    -- Set last updated
    :NEW.last_updated := SYSDATE;
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20002, 
            'No eligibility record found for beneficiary-scheme pair');
END trg_validate_enrollment;
/

-- ============================================================================
-- TRIGGER 2: Update Gap Analysis on Enrollment Changes (AFTER INSERT/UPDATE/DELETE)
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_enrollment_gap_update
AFTER INSERT OR UPDATE OR DELETE ON BENEFICIARY_ENROLLMENT
FOR EACH ROW
BEGIN
    -- Recalculate gap analysis
    IF INSERTING OR UPDATING THEN
        update_gap_analysis(:NEW.beneficiary_id);
    ELSIF DELETING THEN
        update_gap_analysis(:OLD.beneficiary_id);
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error in enrollment gap update: ' || SQLERRM);
END trg_enrollment_gap_update;
/

-- ============================================================================
-- TRIGGER 3: Audit Scheme Changes (AFTER UPDATE ON POLICY_SCHEME)
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_scheme_audit
AFTER UPDATE ON POLICY_SCHEME
FOR EACH ROW
BEGIN
    -- Log changes to audit table
    INSERT INTO AUDIT_LOG VALUES (
        seq_audit_id.NEXTVAL,
        'POLICY_SCHEME',
        'UPDATE',
        :NEW.scheme_id,
        'Budget:' || :OLD.budget_allocation || ', Status:' || :OLD.status,
        'Budget:' || :NEW.budget_allocation || ', Status:' || :NEW.status,
        USER,
        SYSDATE
    );
    
    -- If status changed, trigger metrics update
    IF :OLD.status != :NEW.status THEN
        update_scheme_metrics(:NEW.scheme_id);
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error in scheme audit: ' || SQLERRM);
END trg_scheme_audit;
/

-- ============================================================================
-- TRIGGER 4: Auto-Update Awareness on Beneficiary Registration
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_awareness_auto_update
AFTER INSERT ON BENEFICIARY
FOR EACH ROW
BEGIN
    -- Create awareness records for all active schemes (Unaware status)
    INSERT INTO BENEFICIARY_AWARENESS (
        awareness_id, beneficiary_id, scheme_id, awareness_status, 
        awareness_source, awareness_date, last_updated
    )
    SELECT 
        seq_awareness_id.NEXTVAL, :NEW.beneficiary_id, scheme_id, 'Unaware',
        'Self', SYSDATE, SYSDATE
    FROM POLICY_SCHEME
    WHERE status = 'Active';
    
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error in awareness auto-update: ' || SQLERRM);
END trg_awareness_auto_update;
/

-- ============================================================================
-- TRIGGER 5: Update Family Member When Beneficiary Changes
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_beneficiary_update_audit
AFTER UPDATE ON BENEFICIARY
FOR EACH ROW
BEGIN
    -- Log beneficiary update
    IF :OLD.annual_income != :NEW.annual_income 
       OR :OLD.bpl_status != :NEW.bpl_status
       OR :OLD.disability_status != :NEW.disability_status THEN
        
        INSERT INTO AUDIT_LOG VALUES (
            seq_audit_id.NEXTVAL,
            'BENEFICIARY',
            'UPDATE',
            :NEW.beneficiary_id,
            'Income:' || :OLD.annual_income || ', BPL:' || :OLD.bpl_status,
            'Income:' || :NEW.annual_income || ', BPL:' || :NEW.bpl_status,
            USER,
            SYSDATE
        );
        
        -- Recalculate eligibility due to income/BPL change
        calculate_beneficiary_eligibility(:NEW.beneficiary_id);
        update_gap_analysis(:NEW.beneficiary_id);
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error in beneficiary update: ' || SQLERRM);
END trg_beneficiary_update_audit;
/

-- ============================================================================
-- TRIGGER 6: Update Scheme Metrics on New Enrollment
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_enrollment_metrics_update
AFTER INSERT ON BENEFICIARY_ENROLLMENT
FOR EACH ROW
BEGIN
    update_scheme_metrics(:NEW.scheme_id);
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Don't block enrollment if metrics fail
END trg_enrollment_metrics_update;
/

-- ============================================================================
-- TRIGGER 7: Update Domain Coverage on Enrollment
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_domain_coverage_update
AFTER INSERT ON BENEFICIARY_ENROLLMENT
FOR EACH ROW
DECLARE
    v_domain_id    NUMBER;
    v_location_id  NUMBER;
BEGIN
    -- Get domain and location for this scheme/beneficiary
    SELECT ps.domain_id, b.location_id
    INTO v_domain_id, v_location_id
    FROM POLICY_SCHEME ps, BENEFICIARY b
    WHERE ps.scheme_id = :NEW.scheme_id AND b.beneficiary_id = :NEW.beneficiary_id;
    
    -- Update domain coverage analysis
    MERGE INTO DOMAIN_COVERAGE_ANALYSIS dca
    USING DUAL
    ON (dca.location_id = v_location_id AND dca.domain_id = v_domain_id)
    WHEN MATCHED THEN
        UPDATE SET 
            total_enrolled_beneficiaries = total_enrolled_beneficiaries + 1,
            coverage_percent = (total_enrolled_beneficiaries + 1) / 
                              NULLIF(total_eligible_beneficiaries, 0) * 100,
            calculated_date = SYSDATE
    WHEN NOT MATCHED THEN
        INSERT (coverage_id, location_id, domain_id, total_schemes, 
                total_eligible_beneficiaries, total_enrolled_beneficiaries, 
                coverage_percent, awareness_percent, calculated_date)
        VALUES (seq_coverage_id.NEXTVAL, v_location_id, v_domain_id, 1, 1, 1, 100, 50, SYSDATE);
    
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END trg_domain_coverage_update;
/

-- ============================================================================
-- TRIGGER 8: Validate Eligibility Criteria Update
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_validate_criteria_update
BEFORE INSERT OR UPDATE ON ELIGIBILITY_CRITERIA
FOR EACH ROW
BEGIN
    -- Validate min/max values
    IF :NEW.min_value IS NOT NULL AND :NEW.max_value IS NOT NULL THEN
        IF TO_NUMBER(:NEW.min_value) > TO_NUMBER(:NEW.max_value) THEN
            RAISE_APPLICATION_ERROR(-20003, 
                'Min value cannot be greater than max value');
        END IF;
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END trg_validate_criteria_update;
/

-- ============================================================================
-- TRIGGER 9: Prevent Duplicate Enrollments
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_prevent_duplicate_enrollment
BEFORE INSERT ON BENEFICIARY_ENROLLMENT
FOR EACH ROW
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM BENEFICIARY_ENROLLMENT
    WHERE beneficiary_id = :NEW.beneficiary_id 
    AND scheme_id = :NEW.scheme_id
    AND status IN ('Applied', 'Approved', 'Active');
    
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20004, 
            'Beneficiary already has an active enrollment for this scheme');
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END trg_prevent_duplicate_enrollment;
/

-- ============================================================================
-- TRIGGER 10: Auto-Archive Old Records (AFTER DELETE)
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_archive_old_enrollments
AFTER DELETE ON BENEFICIARY_ENROLLMENT
FOR EACH ROW
BEGIN
    -- Log deletion to audit
    INSERT INTO AUDIT_LOG VALUES (
        seq_audit_id.NEXTVAL,
        'BENEFICIARY_ENROLLMENT',
        'DELETE',
        :OLD.enrollment_id,
        'Beneficiary:' || :OLD.beneficiary_id || ', Scheme:' || :OLD.scheme_id,
        NULL,
        USER,
        SYSDATE
    );
    
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END trg_archive_old_enrollments;
/

-- ============================================================================
-- TRIGGER 11: Update Awareness Status on Campaign Completion
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_campaign_completion
BEFORE UPDATE ON AWARENESS_CAMPAIGN
FOR EACH ROW
BEGIN
    IF :OLD.status != :NEW.status AND :NEW.status = 'Completed' THEN
        -- Generate campaign report
        generate_campaign_report(:NEW.campaign_id);
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END trg_campaign_completion;
/

-- ============================================================================
-- TRIGGER 12: Validate Campaign Budget
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_validate_campaign_budget
BEFORE INSERT OR UPDATE ON AWARENESS_CAMPAIGN
FOR EACH ROW
BEGIN
    IF :NEW.budget_allocated <= 0 THEN
        RAISE_APPLICATION_ERROR(-20005, 'Budget allocation must be positive');
    END IF;
    
    IF :NEW.budget_spent > :NEW.budget_allocated THEN
        RAISE_APPLICATION_ERROR(-20006, 'Spent budget cannot exceed allocated budget');
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END trg_validate_campaign_budget;
/

-- ============================================================================
-- COMMIT
-- ============================================================================

COMMIT;

PROMPT ============================================================================
PROMPT PL/SQL Triggers (12 total) Created Successfully!
PROMPT ============================================================================
