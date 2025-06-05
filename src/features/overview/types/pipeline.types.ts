// Revenue Pipeline Types for Behavioral Health CRM

export interface PipelineStage {
  id: string;
  name: string;
  value: number; // Dollar amount
  count: number; // Number of leads
  previousStageId?: string; // For calculating conversion
}

export interface ConversionRate {
  fromStageId: string;
  toStageId: string;
  rate: number; // Percentage (0-100)
}

export interface InsuranceBreakdown {
  type: string;
  count: number;
  value: number;
  percentage: number;
}

export interface ServiceBreakdown {
  service: string;
  count: number;
  value: number;
  percentage: number;
}

export interface ReferralSource {
  source: string;
  count: number;
  value: number;
  percentage: number;
}

export interface Lead {
  id: string;
  name: string;
  value: number;
  daysInStage: number;
  insuranceType: string;
  referralSource: string;
  service: string;
  lastContact?: Date;
  assignedTo?: string;
  riskReason?: string;
}

export interface StageDetails {
  stageId: string;
  insuranceBreakdown: InsuranceBreakdown[];
  serviceBreakdown: ServiceBreakdown[];
  referralSources: ReferralSource[];
  stuckLeads: number; // Leads idle > 48 hours
  atRiskLeads: number; // High-value leads at risk
  stuckLeadsList?: Lead[]; // List of stuck leads
  atRiskLeadsList?: Lead[]; // List of at-risk leads
}

export interface RevenuePipelineData {
  stages: PipelineStage[];
  conversionRates: ConversionRate[];
  stageDetails: Record<string, StageDetails>;
  lastUpdated: Date;
}

// Helper function to generate mock leads
const generateMockLeads = (
  count: number,
  stageId: string,
  isStuck: boolean = false,
  isAtRisk: boolean = false
): Lead[] => {
  const firstNames = [
    'John',
    'Sarah',
    'Michael',
    'Emily',
    'Robert',
    'Jessica',
    'David',
    'Jennifer',
    'James',
    'Lisa'
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez'
  ];
  const insuranceTypes = [
    'Private Insurance',
    'Medicare',
    'Medicaid',
    'Self-Pay'
  ];
  const services = [
    'Residential Treatment',
    'Outpatient Programs',
    'Detox Services',
    'Sober Living'
  ];
  const referralSources = [
    'Website',
    'Medical Referral',
    'Insurance Partner',
    'Previous Client'
  ];
  const assignees = ['Dr. Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson'];

  const leads: Lead[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const value = Math.floor(Math.random() * 20000) + 5000;

    leads.push({
      id: `${stageId}-lead-${i + 1}`,
      name: `${firstName} ${lastName}`,
      value,
      daysInStage: isStuck
        ? Math.floor(Math.random() * 10) + 3
        : Math.floor(Math.random() * 2) + 1,
      insuranceType:
        insuranceTypes[Math.floor(Math.random() * insuranceTypes.length)],
      service: services[Math.floor(Math.random() * services.length)],
      referralSource:
        referralSources[Math.floor(Math.random() * referralSources.length)],
      lastContact: new Date(Date.now() - (isStuck ? 72 : 24) * 60 * 60 * 1000),
      assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
      riskReason: isAtRisk
        ? value > 15000
          ? 'High value lead with no recent contact'
          : 'Insurance authorization expiring soon'
        : undefined
    });
  }

  return leads;
};

// Mock data generator functions
export const generateMockPipelineData = (): RevenuePipelineData => {
  const stages: PipelineStage[] = [
    {
      id: 'lead-generated',
      name: 'Lead Generated',
      value: 1250000,
      count: 245
    },
    {
      id: 'insurance-verified',
      name: 'Insurance Verified',
      value: 875000,
      count: 156,
      previousStageId: 'lead-generated'
    },
    {
      id: 'intake-scheduled',
      name: 'Intake Scheduled',
      value: 525000,
      count: 89,
      previousStageId: 'insurance-verified'
    },
    {
      id: 'admitted',
      name: 'Admitted',
      value: 425000,
      count: 68,
      previousStageId: 'intake-scheduled'
    }
  ];

  const conversionRates: ConversionRate[] = [
    {
      fromStageId: 'lead-generated',
      toStageId: 'insurance-verified',
      rate: 63.7
    },
    {
      fromStageId: 'insurance-verified',
      toStageId: 'intake-scheduled',
      rate: 57.1
    },
    {
      fromStageId: 'intake-scheduled',
      toStageId: 'admitted',
      rate: 76.4
    }
  ];

  const stageDetails: Record<string, StageDetails> = {
    'lead-generated': {
      stageId: 'lead-generated',
      insuranceBreakdown: [
        { type: 'Private Insurance', count: 98, value: 612500, percentage: 40 },
        { type: 'Medicare', count: 61, value: 312500, percentage: 25 },
        { type: 'Medicaid', count: 49, value: 200000, percentage: 20 },
        { type: 'Self-Pay', count: 37, value: 125000, percentage: 15 }
      ],
      serviceBreakdown: [
        {
          service: 'Residential Treatment',
          count: 110,
          value: 687500,
          percentage: 45
        },
        {
          service: 'Outpatient Programs',
          count: 74,
          value: 312500,
          percentage: 30
        },
        { service: 'Detox Services', count: 37, value: 187500, percentage: 15 },
        { service: 'Sober Living', count: 24, value: 62500, percentage: 10 }
      ],
      referralSources: [
        { source: 'Website', count: 86, value: 437500, percentage: 35 },
        {
          source: 'Medical Referral',
          count: 61,
          value: 375000,
          percentage: 25
        },
        {
          source: 'Insurance Partner',
          count: 49,
          value: 250000,
          percentage: 20
        },
        { source: 'Previous Client', count: 37, value: 125000, percentage: 15 },
        { source: 'Other', count: 12, value: 62500, percentage: 5 }
      ],
      stuckLeads: 12,
      atRiskLeads: 8,
      stuckLeadsList: generateMockLeads(12, 'lead-generated', true, false),
      atRiskLeadsList: generateMockLeads(8, 'lead-generated', false, true)
    },
    'insurance-verified': {
      stageId: 'insurance-verified',
      insuranceBreakdown: [
        { type: 'Private Insurance', count: 78, value: 437500, percentage: 50 },
        { type: 'Medicare', count: 39, value: 218750, percentage: 25 },
        { type: 'Medicaid', count: 23, value: 131250, percentage: 15 },
        { type: 'Self-Pay', count: 16, value: 87500, percentage: 10 }
      ],
      serviceBreakdown: [
        {
          service: 'Residential Treatment',
          count: 86,
          value: 481250,
          percentage: 55
        },
        {
          service: 'Outpatient Programs',
          count: 39,
          value: 218750,
          percentage: 25
        },
        { service: 'Detox Services', count: 23, value: 131250, percentage: 15 },
        { service: 'Sober Living', count: 8, value: 43750, percentage: 5 }
      ],
      referralSources: [
        {
          source: 'Medical Referral',
          count: 55,
          value: 350000,
          percentage: 35
        },
        { source: 'Website', count: 47, value: 262500, percentage: 30 },
        {
          source: 'Insurance Partner',
          count: 31,
          value: 175000,
          percentage: 20
        },
        { source: 'Previous Client', count: 23, value: 87500, percentage: 15 }
      ],
      stuckLeads: 8,
      atRiskLeads: 5,
      stuckLeadsList: generateMockLeads(8, 'insurance-verified', true, false),
      atRiskLeadsList: generateMockLeads(5, 'insurance-verified', false, true)
    },
    'intake-scheduled': {
      stageId: 'intake-scheduled',
      insuranceBreakdown: [
        { type: 'Private Insurance', count: 53, value: 315000, percentage: 60 },
        { type: 'Medicare', count: 18, value: 105000, percentage: 20 },
        { type: 'Medicaid', count: 13, value: 78750, percentage: 15 },
        { type: 'Self-Pay', count: 5, value: 26250, percentage: 5 }
      ],
      serviceBreakdown: [
        {
          service: 'Residential Treatment',
          count: 58,
          value: 341250,
          percentage: 65
        },
        {
          service: 'Outpatient Programs',
          count: 18,
          value: 105000,
          percentage: 20
        },
        { service: 'Detox Services', count: 9, value: 52500, percentage: 10 },
        { service: 'Sober Living', count: 4, value: 26250, percentage: 5 }
      ],
      referralSources: [
        {
          source: 'Medical Referral',
          count: 36,
          value: 210000,
          percentage: 40
        },
        {
          source: 'Insurance Partner',
          count: 27,
          value: 157500,
          percentage: 30
        },
        { source: 'Website', count: 18, value: 105000, percentage: 20 },
        { source: 'Previous Client', count: 8, value: 52500, percentage: 10 }
      ],
      stuckLeads: 3,
      atRiskLeads: 4,
      stuckLeadsList: generateMockLeads(3, 'intake-scheduled', true, false),
      atRiskLeadsList: generateMockLeads(4, 'intake-scheduled', false, true)
    },
    admitted: {
      stageId: 'admitted',
      insuranceBreakdown: [
        { type: 'Private Insurance', count: 44, value: 276250, percentage: 65 },
        { type: 'Medicare', count: 14, value: 85000, percentage: 20 },
        { type: 'Medicaid', count: 7, value: 42500, percentage: 10 },
        { type: 'Self-Pay', count: 3, value: 21250, percentage: 5 }
      ],
      serviceBreakdown: [
        {
          service: 'Residential Treatment',
          count: 48,
          value: 297500,
          percentage: 70
        },
        {
          service: 'Outpatient Programs',
          count: 10,
          value: 63750,
          percentage: 15
        },
        { service: 'Detox Services', count: 7, value: 42500, percentage: 10 },
        { service: 'Sober Living', count: 3, value: 21250, percentage: 5 }
      ],
      referralSources: [
        {
          source: 'Medical Referral',
          count: 30,
          value: 191250,
          percentage: 45
        },
        {
          source: 'Insurance Partner',
          count: 20,
          value: 127500,
          percentage: 30
        },
        { source: 'Website', count: 10, value: 63750, percentage: 15 },
        { source: 'Previous Client', count: 8, value: 42500, percentage: 10 }
      ],
      stuckLeads: 0,
      atRiskLeads: 0,
      stuckLeadsList: [],
      atRiskLeadsList: []
    }
  };

  return {
    stages,
    conversionRates,
    stageDetails,
    lastUpdated: new Date()
  };
};

// Helper function to generate variations in data for demo purposes
export const generateVariation = (
  baseValue: number,
  variance: number = 0.2
): number => {
  const min = baseValue * (1 - variance);
  const max = baseValue * (1 + variance);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper to format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Helper to format large numbers
export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};
