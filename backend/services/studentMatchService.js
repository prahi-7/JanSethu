// ============================================================
// STUDENT ↔ PROBLEM MATCHING SERVICE
// ============================================================

const normalizeText = (value) => {
  if (!value) return '';

  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const normalizeArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flat(Infinity)
      .filter(Boolean)
      .map(item => normalizeText(item))
      .filter(Boolean);
  }

  return [normalizeText(value)].filter(Boolean);
};

// ============================================================
// ACADEMIC / DOMAIN ALIASES
// ============================================================

const aliases = {
  civil: [
    'civil',
    'civil engineering',
    'construction',
    'construction engineering',
    'structural engineering',
    'structural',
    'transportation engineering',
    'transportation',
    'highway engineering',
    'highway',
    'geotechnical engineering',
    'geotechnical',
    'infrastructure',
    'surveying',
    'gis',
    'urban planning'
  ],

  cse: [
    'cse',
    'computer science',
    'computer science engineering',
    'software engineering',
    'software',
    'information technology',
    'information technology engineering',
    'it',
    'computer engineering',
    'web development',
    'app development',
    'programming'
  ],

  ai: [
    'artificial intelligence',
    'ai',
    'machine learning',
    'ml',
    'data science',
    'deep learning',
    'natural language processing',
    'nlp',
    'computer vision'
  ],

  commerce: [
    'commerce',
    'bcom',
    'business',
    'business administration',
    'finance',
    'accounting',
    'marketing',
    'economics'
  ],

  eee: [
    'eee',
    'electrical',
    'electrical engineering',
    'electronics',
    'electronics engineering',
    'electrical and electronics engineering',
    'power systems',
    'power',
    'renewable energy',
    'solar',
    'energy'
  ],

  ece: [
    'ece',
    'electronics and communication',
    'electronics communication engineering',
    'communication engineering',
    'embedded systems',
    'embedded',
    'iot',
    'internet of things',
    'communication'
  ],

  mechanical: [
    'mechanical',
    'mechanical engineering',
    'automobile engineering',
    'automobile',
    'automotive',
    'manufacturing engineering',
    'manufacturing',
    'robotics',
    'robotics engineering',
    'machines'
  ],

  environmental: [
    'environmental',
    'environmental engineering',
    'environment science',
    'environmental science',
    'pollution',
    'waste management',
    'waste',
    'sustainability',
    'sustainable'
  ],

  architecture: [
    'architecture',
    'architectural engineering',
    'architect',
    'building design',
    'urban planning'
  ],

  biomedical: [
    'biomedical',
    'biomedical engineering',
    'medical engineering',
    'biotechnology',
    'biotech',
    'healthcare',
    'medical'
  ],

  chemical: [
    'chemical',
    'chemical engineering',
    'chemistry',
    'chemical processing'
  ],

  agriculture: [
    'agriculture',
    'agricultural engineering',
    'agricultural science',
    'farming',
    'crop',
    'irrigation'
  ]
};

// ============================================================
// CATEGORY → RELEVANT DOMAINS
// ============================================================

const categoryDomains = {
  roads: [
    'civil',
  'transportation',
  'highway',
  'structural',
  'geotechnical',
  'construction',
  'infrastructure',
  'surveying',
  'gis',
  'urban planning',
  'mechanical',
  'environmental',
  'architecture'
  ],

  water: [
    'civil',
    'environmental',
    'water resources',
    'hydrology',
    'mechanical',
    'chemical',
    'agriculture',
    'eee',
    'ece'
  ],

  electricity: [
    'eee',
    'electrical',
    'ece',
    'electronics',
    'power systems',
    'renewable energy',
    'energy',
    'iot'
  ],

  sanitation: [
    'civil',
    'environmental',
    'water resources',
    'public health',
    'chemical',
    'biomedical'
  ],

  healthcare: [
    'biomedical',
    'biotechnology',
    'cse',
    'ai',
    'ece',
    'electronics',
    'mechanical',
    'chemical'
  ],

  education: [
    'cse',
    'ai',
    'it',
    'software',
    'education',
    'electronics',
    'ece'
  ],

  transport: [
    'civil',
    'transportation',
    'mechanical',
    'automobile',
    'eee',
    'ece',
    'cse',
    'ai'
  ],

  housing: [
    'civil',
    'architecture',
    'structural',
    'construction',
    'urban planning',
    'mechanical',
    'electrical',
    'eee'
  ],

  environment: [
    'environmental',
    'civil',
    'chemical',
    'agriculture',
    'biotechnology',
    'cse',
    'ai',
    'eee',
    'ece'
  ],

  waste: [
    'environmental',
    'civil',
    'chemical',
    'agriculture',
    'biotechnology',
    'cse',
    'ai',
    'eee',
    'mechanical'
  ],

  pollution: [
    'environmental',
    'chemical',
    'civil',
    'biotechnology',
    'agriculture',
    'cse',
    'ai',
    'eee',
    'ece'
  ],

  technology: [
    'cse',
    'ai',
    'ece',
    'eee',
    'mechanical',
    'robotics',
    'iot'
  ],

  other: [
    'civil',
    'cse',
    'ai',
    'eee',
    'ece',
    'mechanical',
    'environmental',
    'architecture',
    'biomedical',
    'chemical',
    'agriculture',
    'commerce'
  ]
};

// ============================================================
// TEXT HELPERS
// ============================================================

const matchesAlias = (text, alias) => {
  const normalizedText = normalizeText(text);
  const normalizedAlias = normalizeText(alias);

  if (!normalizedText || !normalizedAlias) {
    return false;
  }

  return (
    normalizedText === normalizedAlias ||
    normalizedText.includes(normalizedAlias) ||
    normalizedAlias.includes(normalizedText)
  );
};

// ============================================================
// DETECT STUDENT DOMAINS
// ============================================================

const detectStudentDomains = (student) => {
  const domains = [];

  // ==========================================================
  // DEPARTMENT MATCHING
  // ==========================================================

  const department =
    normalizeText(student.department);

  if (department) {
    for (const [domain, domainAliases] of Object.entries(aliases)) {
      const departmentMatch = domainAliases.some(alias => {
        const normalizedAlias = normalizeText(alias);

        // Exact department match
        if (department === normalizedAlias) {
          return true;
        }

        // Department contains a meaningful full alias
        if (
          normalizedAlias.length >= 4 &&
          department.includes(normalizedAlias)
        ) {
          return true;
        }

        return false;
      });

      if (
        departmentMatch &&
        !domains.includes(domain)
      ) {
        domains.push(domain);
      }
    }
  }

  // ==========================================================
  // SKILLS + EXPERTISE + DESIGNATION
  // ==========================================================

  const additionalValues = [
    student.designation,
    ...normalizeArray(student.skills),
    ...normalizeArray(student.expertise)
  ];

  for (const value of additionalValues) {
    if (!value) continue;

    for (const [domain, domainAliases] of Object.entries(aliases)) {
      const match = domainAliases.some(alias => {
        const normalizedAlias = normalizeText(alias);

        if (!normalizedAlias) {
          return false;
        }

        // Exact match
        if (value === normalizedAlias) {
          return true;
        }

        // Only allow substring matching for meaningful aliases
        if (
          normalizedAlias.length >= 4 &&
          value.includes(normalizedAlias)
        ) {
          return true;
        }

        return false;
      });

      if (
        match &&
        !domains.includes(domain)
      ) {
        domains.push(domain);
      }
    }
  }

  return domains;
};
// ============================================================
// TERM MATCHING
// ============================================================

const termsMatch = (studentTerm, problemTerm) => {
  const a = normalizeText(studentTerm);
  const b = normalizeText(problemTerm);

  if (!a || !b) return false;

  if (a === b) return true;

  if (
    a.includes(b) ||
    b.includes(a)
  ) {
    return true;
  }

  const aWords = new Set(a.split(' '));
  const bWords = new Set(b.split(' '));

  for (const word of aWords) {
    if (
      word.length >= 4 &&
      bWords.has(word)
    ) {
      return true;
    }
  }

  return false;
};

const getMatchedTerms = (
  studentTerms,
  problemTerms
) => {
  const matches = [];

  for (const studentTerm of studentTerms) {
    for (const problemTerm of problemTerms) {
      if (
        termsMatch(
          studentTerm,
          problemTerm
        )
      ) {
        matches.push({
          student: studentTerm,
          problem: problemTerm
        });

        break;
      }
    }
  }

  return matches;
};

// ============================================================
// CATEGORY MATCH
// ============================================================

const calculateCategoryMatch = (
  student,
  problemCategory
) => {
  const category = normalizeText(problemCategory);

  if (!category) {
    return {
      matched: false,
      score: 0,
      domains: []
    };
  }

  const domains =
    categoryDomains[category] || [];

  const studentDomains =
    detectStudentDomains(student);

  const matchedDomains = [];

  // ----------------------------------------------------------
  // Direct domain matching
  // ----------------------------------------------------------

  for (const studentDomain of studentDomains) {
    if (
      domains.includes(studentDomain) &&
      !matchedDomains.includes(studentDomain)
    ) {
      matchedDomains.push(studentDomain);
    }
  }

  // ----------------------------------------------------------
  // Flexible category checks
  // ----------------------------------------------------------

  const department =
    normalizeText(student.department);

  // Roads / infrastructure
  if (category === 'roads') {
    const roadTerms = [
      'civil',
      'transport',
      'structural',
      'highway',
      'construction',
      'geotechnical',
      'infrastructure',
      'surveying',
      'gis',
      'urban planning'
    ];

    if (
      roadTerms.some(term =>
        department.includes(term)
      )
    ) {
      if (!matchedDomains.includes('civil')) {
        matchedDomains.push('civil');
      }
    }
  }

  // Water
  if (category === 'water') {
    const waterTerms = [
      'civil',
      'environment',
      'agriculture',
      'hydrology',
      'water'
    ];

    if (
      waterTerms.some(term =>
        department.includes(term)
      )
    ) {
      if (
        department.includes('agriculture') &&
        !matchedDomains.includes('agriculture')
      ) {
        matchedDomains.push('agriculture');
      } else if (
        department.includes('environment') &&
        !matchedDomains.includes('environmental')
      ) {
        matchedDomains.push('environmental');
      } else if (
        !matchedDomains.includes('civil')
      ) {
        matchedDomains.push('civil');
      }
    }
  }

  // Electricity
  if (category === 'electricity') {
    const electricityTerms = [
      'electrical',
      'eee',
      'ece',
      'electronics',
      'power',
      'energy'
    ];

    if (
      electricityTerms.some(term =>
        department.includes(term)
      )
    ) {
      if (
        department.includes('electrical') ||
        department.includes('eee')
      ) {
        if (!matchedDomains.includes('eee')) {
          matchedDomains.push('eee');
        }
      } else if (
        department.includes('ece') ||
        department.includes('electronics')
      ) {
        if (!matchedDomains.includes('ece')) {
          matchedDomains.push('ece');
        }
      }
    }
  }

  return {
    matched:
      matchedDomains.length > 0,

    score:
      matchedDomains.length > 0
        ? 100
        : 0,

    domains: matchedDomains
  };
};

// ============================================================
// MAIN MATCH FUNCTION
// ============================================================

const calculateStudentProblemMatch = (
  student,
  problem
) => {

  if (!student || !problem) {
    return {
      score: 0,
      percentage: 0,
      level: 'Low',
      matched: [],
      matchedSkills: [],
      matchedExpertise: [],
      matchedTechnologies: [],
      matchedDisciplines: [],
      matchedKeywords: [],
      matchedDepartment: false,
      categoryMatch: false,
      aiProcessed: false
    };
  }

  // ==========================================================
  // STUDENT INFORMATION
  // ==========================================================

  const studentSkills =
    normalizeArray(student.skills);

  const studentExpertise =
    normalizeArray(student.expertise);

  const studentDepartment =
    normalizeText(student.department);

  const studentDesignation =
    normalizeText(student.designation);

  const studentDomains =
    detectStudentDomains(student);

  // ==========================================================
  // AI PROBLEM INFORMATION
  // ==========================================================

  const ai =
    problem.aiAnalysis || {};

  const problemCategory =
    normalizeText(
      ai.category ||
      problem.category ||
      'other'
    );

  const problemDisciplines =
    normalizeArray(
      ai.disciplines
    );

  const problemTechnologies =
    normalizeArray(
      ai.technologies
    );

  const problemKeywords =
    normalizeArray(
      ai.keywords
    );

  const problemDepartments =
    normalizeArray(
      ai.departments
    );

  // ==========================================================
  // PROBLEM TEXT
  // ==========================================================

  const problemText =
    normalizeText(
      [
        problem.title,
        problem.description,
        problemCategory,
        ...problemDisciplines,
        ...problemTechnologies,
        ...problemKeywords,
        ...problemDepartments,
        ai.summary
      ].join(' ')
    );

  // ==========================================================
  // STUDENT TEXT
  // ==========================================================

  const studentText =
    normalizeText(
      [
        studentDepartment,
        studentDesignation,
        ...studentSkills,
        ...studentExpertise,
        ...studentDomains
      ].join(' ')
    );

  // ==========================================================
  // DIRECT MATCHING
  // ==========================================================

  const matchingProblemTerms = [
    ...problemKeywords,
    ...problemTechnologies,
    ...problemDisciplines,
    ...problemDepartments
  ];

  const matchedSkills =
    getMatchedTerms(
      studentSkills,
      matchingProblemTerms
    );

  const matchedExpertise =
    getMatchedTerms(
      studentExpertise,
      matchingProblemTerms
    );

  const matchedTechnologies =
    getMatchedTerms(
      studentSkills,
      problemTechnologies
    );

  const matchedDisciplines =
    getMatchedTerms(
      [
        ...studentExpertise,
        ...studentSkills,
        studentDepartment
      ],
      problemDisciplines
    );

  const matchedKeywords =
    getMatchedTerms(
      [
        ...studentSkills,
        ...studentExpertise,
        studentDepartment,
        studentDesignation
      ],
      problemKeywords
    );

  // ==========================================================
  // DEPARTMENT MATCHING
  // ==========================================================

  let matchedDepartment = false;

  if (studentDepartment) {

    matchedDepartment =
      problemDepartments.some(
        department =>
          termsMatch(
            studentDepartment,
            department
          )
      );

    if (!matchedDepartment) {
      matchedDepartment =
        problemDisciplines.some(
          discipline =>
            termsMatch(
              studentDepartment,
              discipline
            )
        );
    }
  }

  // ==========================================================
  // CATEGORY / DOMAIN MATCH
  // ==========================================================

  const categoryResult =
    calculateCategoryMatch(
      student,
      problemCategory
    );

  // ==========================================================
  // DOMAIN MATCH AGAINST ENTIRE AI PROBLEM
  // ==========================================================

  let domainMatch = false;

  const matchedDomainNames = [];

  for (const domain of studentDomains) {

    const domainAliases =
      aliases[domain] || [];

    for (const alias of domainAliases) {

      const normalizedAlias =
        normalizeText(alias);

      if (
        normalizedAlias &&
        problemText.includes(normalizedAlias)
      ) {
        domainMatch = true;

        if (
          !matchedDomainNames.includes(domain)
        ) {
          matchedDomainNames.push(domain);
        }

        break;
      }
    }
  }

  // ==========================================================
  // GENERAL TEXT MATCH
  // ==========================================================

  let generalTextMatch = false;

  const studentTerms = [
    ...studentSkills,
    ...studentExpertise,
    studentDepartment,
    studentDesignation
  ].filter(Boolean);

  const problemTerms = [
    problemCategory,
    ...problemDisciplines,
    ...problemTechnologies,
    ...problemKeywords,
    ...problemDepartments
  ].filter(Boolean);

  let generalMatches = 0;

  for (const studentTerm of studentTerms) {

    for (const problemTerm of problemTerms) {

      if (
        termsMatch(
          studentTerm,
          problemTerm
        )
      ) {
        generalMatches++;
        generalTextMatch = true;
        break;
      }
    }
  }

  // ==========================================================
  // SCORE
  // ==========================================================

  let score = 0;

  // Skills
  if (matchedSkills.length > 0) {
    score += Math.min(
      25,
      matchedSkills.length * 8
    );
  }

  // Expertise
  if (matchedExpertise.length > 0) {
    score += Math.min(
      20,
      matchedExpertise.length * 8
    );
  }

  // Department
  if (matchedDepartment) {
    score += 20;
  }

  // Technologies
  if (matchedTechnologies.length > 0) {
    score += Math.min(
      15,
      matchedTechnologies.length * 5
    );
  }

  // Disciplines
  if (matchedDisciplines.length > 0) {
    score += Math.min(
      10,
      matchedDisciplines.length * 5
    );
  }

  // Keywords
  if (matchedKeywords.length > 0) {
    score += Math.min(
      5,
      matchedKeywords.length * 2
    );
  }

  // ==========================================================
  // CATEGORY BONUS
  // ==========================================================

  if (categoryResult.matched) {
    score += 20;
  } else if (domainMatch) {
    score += 15;
  }

  // ==========================================================
  // GENERAL MATCH BONUS
  // ==========================================================

  if (generalTextMatch) {
    score += Math.min(
      10,
      generalMatches * 2
    );
  }

  // ==========================================================
  // IMPORTANT FALLBACK
  // ==========================================================

  if (
    categoryResult.matched &&
    score < 35
  ) {
    score = 35;
  }

  if (
    domainMatch &&
    score < 25
  ) {
    score = 25;
  }

  // ==========================================================
  // VERY BROAD CATEGORY FALLBACK
  // ==========================================================

  if (
    !categoryResult.matched &&
    !domainMatch &&
    generalTextMatch &&
    score < 20
  ) {
    score = 20;
  }

  // ==========================================================
  // CLAMP
  // ==========================================================

  score =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(score)
      )
    );

  // ==========================================================
  // MATCH LEVEL
  // ==========================================================

  let level = 'Low';

  if (score >= 80) {
    level = 'Excellent';
  } else if (score >= 60) {
    level = 'High';
  } else if (score >= 40) {
    level = 'Good';
  } else if (score >= 20) {
    level = 'Moderate';
  }

  // ==========================================================
  // REASON
  // ==========================================================

  let reason =
    'Limited direct matching information was found.';

  if (categoryResult.matched) {

    reason =
      `Your ${student.department || 'academic background'} is relevant to the ${problemCategory} problem category.`;

  } else if (matchedDepartment) {

    reason =
      'Your academic department is relevant to this problem.';

  } else if (domainMatch) {

    reason =
      'Your academic domain, skills, or expertise are relevant to this problem.';

  } else if (
    matchedSkills.length ||
    matchedExpertise.length
  ) {

    reason =
      'Some of your skills or expertise match the problem requirements.';

  } else if (generalTextMatch) {

    reason =
      'Your profile contains information related to the problem.';
  }

  // ==========================================================
  // RETURN
  // ==========================================================

  return {

    score,

    percentage: score,

    level,

    matched: [
      ...categoryResult.domains,
      ...matchedDomainNames,
      ...matchedSkills.map(
        m => m.student
      ),
      ...matchedExpertise.map(
        m => m.student
      )
    ].filter(Boolean),

    matchedSkills:
      matchedSkills.map(
        m => m.student
      ),

    matchedExpertise:
      matchedExpertise.map(
        m => m.student
      ),

    matchedTechnologies:
      matchedTechnologies.map(
        m => m.student
      ),

    matchedDisciplines:
      matchedDisciplines.map(
        m => m.student
      ),

    matchedKeywords:
      matchedKeywords.map(
        m => m.student
      ),

    matchedDepartment,

    categoryMatch:
      categoryResult.matched,

    matchedDomains: [
      ...new Set([
        ...categoryResult.domains,
        ...matchedDomainNames
      ])
    ],

    studentDomains,

    aiProcessed:
      ai.status === 'Completed' ||
      Boolean(ai.category),

    problemCategory,

    reason
  };
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  calculateStudentProblemMatch,
  normalizeText,
  normalizeArray,
  detectStudentDomains
};