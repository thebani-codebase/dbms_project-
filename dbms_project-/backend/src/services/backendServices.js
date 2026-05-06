// ============================================================================
// ELIGIBILITY SERVICE
// Manages scheme eligibility matching for beneficiaries
// ============================================================================

const { getOracleConnection } = require('../db/oracleConnection');

class EligibilityService {
  
  async calculateEligibility(beneficiaryId) {
    const connection = await getOracleConnection();
    
    try {
      // Call PL/SQL procedure
      await connection.execute(
        `BEGIN calculate_beneficiary_eligibility(:beneficiary_id); END;`,
        { beneficiary_id: beneficiaryId }
      );
      
      // Fetch results
      const result = await connection.execute(
        `SELECT 
          scheme_id, scheme_name, is_eligible, eligibility_score, 
          matched_criteria, total_criteria
        FROM ELIGIBILITY_MATCH em
        JOIN POLICY_SCHEME ps ON em.scheme_id = ps.scheme_id
        WHERE em.beneficiary_id = :beneficiary_id
        ORDER BY eligibility_score DESC`,
        { beneficiary_id: beneficiaryId },
        { outFormat: 3 }
      );
      
      return {
        success: true,
        eligibilityMatches: result.rows,
        totalSchemes: result.rows.length,
        eligibleCount: result.rows.filter(r => r.IS_ELIGIBLE === 'Y').length,
      };
    } finally {
      await connection.close();
    }
  }

  async getEligibleSchemes(beneficiaryId) {
    const connection = await getOracleConnection();
    
    try {
      const result = await connection.execute(
        `SELECT 
          ps.scheme_id, ps.scheme_name, ps.scheme_code,
          sd.domain_name, sb.benefit_name, sb.benefit_amount,
          sb.frequency, em.eligibility_score
        FROM ELIGIBILITY_MATCH em
        JOIN POLICY_SCHEME ps ON em.scheme_id = ps.scheme_id
        JOIN SCHEME_DOMAIN sd ON ps.domain_id = sd.domain_id
        LEFT JOIN SCHEME_BENEFIT sb ON ps.scheme_id = sb.scheme_id
        WHERE em.beneficiary_id = :beneficiary_id 
        AND em.is_eligible = 'Y'
        ORDER BY em.eligibility_score DESC`,
        { beneficiary_id: beneficiaryId },
        { outFormat: 3 }
      );
      
      // Group by scheme
      const schemes = {};
      result.rows.forEach(row => {
        if (!schemes[row.SCHEME_ID]) {
          schemes[row.SCHEME_ID] = {
            schemeId: row.SCHEME_ID,
            schemeName: row.SCHEME_NAME,
            schemeCode: row.SCHEME_CODE,
            domainName: row.DOMAIN_NAME,
            eligibilityScore: row.ELIGIBILITY_SCORE,
            benefits: [],
          };
        }
        schemes[row.SCHEME_ID].benefits.push({
          benefitName: row.BENEFIT_NAME,
          amount: row.BENEFIT_AMOUNT,
          frequency: row.FREQUENCY,
        });
      });
      
      return {
        success: true,
        schemes: Object.values(schemes),
      };
    } finally {
      await connection.close();
    }
  }

  async checkSpecificEligibility(beneficiaryId, schemeId) {
    const connection = await getOracleConnection();
    
    try {
      const result = await connection.execute(
        `SELECT 
          is_eligible, eligibility_score, matched_criteria, total_criteria
        FROM ELIGIBILITY_MATCH
        WHERE beneficiary_id = :beneficiary_id AND scheme_id = :scheme_id`,
        { beneficiary_id: beneficiaryId, scheme_id: schemeId },
        { outFormat: 3 }
      );
      
      if (result.rows.length === 0) {
        return { success: false, error: 'No eligibility record found' };
      }
      
      return {
        success: true,
        eligibility: result.rows[0],
      };
    } finally {
      await connection.close();
    }
  }
}

// ============================================================================
// ENROLLMENT SERVICE
// Manages beneficiary enrollments in schemes
// ============================================================================

class EnrollmentService {
  
  async enrollBeneficiary(beneficiaryId, schemeId) {
    const connection = await getOracleConnection();
    
    try {
      const result = await connection.execute(
        `INSERT INTO BENEFICIARY_ENROLLMENT (
          enrollment_id, beneficiary_id, scheme_id, enrollment_date, status
        ) VALUES (
          seq_enrollment_id.NEXTVAL, :beneficiary_id, :scheme_id, SYSDATE, 'Applied'
        ) RETURNING enrollment_id INTO :enrollment_id`,
        {
          beneficiary_id: beneficiaryId,
          scheme_id: schemeId,
          enrollment_id: { dir: 3001 }, // OUT parameter
        }
      );
      
      await connection.commit();
      
      return {
        success: true,
        enrollmentId: result.outBinds.enrollment_id[0],
        message: 'Enrollment application submitted successfully',
      };
    } catch (error) {
      await connection.rollback();
      return {
        success: false,
        error: error.message,
      };
    } finally {
      await connection.close();
    }
  }

  async getEnrollmentStatus(beneficiaryId) {
    const connection = await getOracleConnection();
    
    try {
      const result = await connection.execute(
        `SELECT 
          be.enrollment_id, ps.scheme_name, be.status, be.enrollment_date,
          be.approval_date, be.annual_benefit_received
        FROM BENEFICIARY_ENROLLMENT be
        JOIN POLICY_SCHEME ps ON be.scheme_id = ps.scheme_id
        WHERE be.beneficiary_id = :beneficiary_id
        ORDER BY be.enrollment_date DESC`,
        { beneficiary_id: beneficiaryId },
        { outFormat: 3 }
      );
      
      return {
        success: true,
        enrollments: result.rows,
        totalEnrolled: result.rows.filter(e => e.STATUS === 'Active').length,
      };
    } finally {
      await connection.close();
    }
  }

  async updateEnrollmentStatus(enrollmentId, newStatus, approvalNotes) {
    const connection = await getOracleConnection();
    
    try {
      await connection.execute(
        `UPDATE BENEFICIARY_ENROLLMENT
        SET status = :status, 
            approval_date = CASE WHEN :status = 'Approved' THEN SYSDATE ELSE approval_date END,
            last_updated = SYSDATE
        WHERE enrollment_id = :enrollment_id`,
        {
          status: newStatus,
          enrollment_id: enrollmentId,
        }
      );
      
      await connection.commit();
      
      return {
        success: true,
        message: `Enrollment status updated to ${newStatus}`,
      };
    } finally {
      await connection.close();
    }
  }
}

// ============================================================================
// ANALYTICS SERVICE
// Provides analytics and reporting
// ============================================================================

class AnalyticsService {
  
  async getGapAnalysis(beneficiaryId) {
    const connection = await getOracleConnection();
    
    try {
      // Call PL/SQL procedure
      await connection.execute(
        `BEGIN update_gap_analysis(:beneficiary_id); END;`,
        { beneficiary_id: beneficiaryId }
      );
      
      // Fetch gap analysis
      const result = await connection.execute(
        `SELECT 
          total_eligible_schemes, total_enrolled_schemes, gap_count,
          potential_annual_benefit_missed, priority_score, calculated_date
        FROM ENROLLMENT_GAP_ANALYSIS
        WHERE beneficiary_id = :beneficiary_id`,
        { beneficiary_id: beneficiaryId },
        { outFormat: 3 }
      );
      
      return {
        success: true,
        gapAnalysis: result.rows[0] || {},
      };
    } finally {
      await connection.close();
    }
  }

  async getSchemeMetrics(schemeId) {
    const connection = await getOracleConnection();
    
    try {
      const result = await connection.execute(
        `SELECT 
          scheme_id, total_eligible, total_enrolled, enrollment_rate,
          total_benefit_disbursed, avg_time_to_approval, 
          document_completion_rate, satisfaction_score, calculated_date
        FROM SCHEME_PERFORMANCE_METRICS
        WHERE scheme_id = :scheme_id`,
        { scheme_id: schemeId },
        { outFormat: 3 }
      );
      
      return {
        success: true,
        metrics: result.rows[0] || {},
      };
    } finally {
      await connection.close();
    }
  }

  async getDomainCoverage(locationId, domainId) {
    const connection = await getOracleConnection();
    
    try {
      const result = await connection.execute(
        `SELECT 
          total_schemes, total_eligible_beneficiaries,
          total_enrolled_beneficiaries, coverage_percent, awareness_percent
        FROM DOMAIN_COVERAGE_ANALYSIS
        WHERE location_id = :location_id AND domain_id = :domain_id`,
        { location_id: locationId, domain_id: domainId },
        { outFormat: 3 }
      );
      
      return {
        success: true,
        coverage: result.rows[0] || {},
      };
    } finally {
      await connection.close();
    }
  }

  async getCampaignReport(campaignId) {
    const connection = await getOracleConnection();
    
    try {
      // Call PL/SQL procedure
      await connection.execute(
        `BEGIN generate_campaign_report(:campaign_id); END;`,
        { campaign_id: campaignId }
      );
      
      const result = await connection.execute(
        `SELECT 
          c.campaign_name, c.status, c.budget_allocated, c.budget_spent,
          COUNT(DISTINCT ba.beneficiary_id) as beneficiaries_reached,
          COUNT(DISTINCT be.enrollment_id) as enrollments_created,
          ci.improvement_percent as roi_percent
        FROM AWARENESS_CAMPAIGN c
        LEFT JOIN BENEFICIARY_AWARENESS ba ON c.campaign_id = ba.campaign_id
        LEFT JOIN BENEFICIARY_ENROLLMENT be ON c.campaign_id = be.enrollment_id
        LEFT JOIN CAMPAIGN_IMPACT ci ON c.campaign_id = ci.campaign_id
        WHERE c.campaign_id = :campaign_id
        GROUP BY c.campaign_name, c.status, c.budget_allocated, c.budget_spent, ci.improvement_percent`,
        { campaign_id: campaignId },
        { outFormat: 3 }
      );
      
      return {
        success: true,
        report: result.rows[0] || {},
      };
    } finally {
      await connection.close();
    }
  }
}

module.exports = {
  EligibilityService,
  EnrollmentService,
  AnalyticsService,
};
