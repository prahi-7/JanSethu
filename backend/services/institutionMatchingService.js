const Institution = require('../models/Institution');
const User = require('../models/User');

// ================================================================
// NORMALIZE TEXT
// ================================================================

const normalize = (value) => {
  return String(value || '')
    .toLowerCase()
    .trim();
};

// ================================================================
// NORMALIZE ARRAY
// ================================================================

const normalizeArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) =>
      normalize(item)
    )
    .filter(Boolean);
};

// ================================================================
// UNIQUE VALUES
// ================================================================

const unique = (items) => {
  return [
    ...new Set(
      items.filter(Boolean)
    )
  ];
};

// ================================================================
// CHECK WHETHER TWO VALUES ARE RELATED
// ================================================================

const similarity = (a, b) => {
  const x = normalize(a);
  const y = normalize(b);

  if (!x || !y) {
    return false;
  }

  if (x === y) {
    return true;
  }

  return (
    x.includes(y) ||
    y.includes(x)
  );
};

// ================================================================
// FIND MATCHING VALUES
// ================================================================

const matchingValues = (
  problemValues,
  institutionValues
) => {
  const matches = [];

  for (
    const problemValue of problemValues
  ) {
    for (
      const institutionValue of institutionValues
    ) {
      if (
        similarity(
          problemValue,
          institutionValue
        )
      ) {
        matches.push(
          problemValue
        );

        break;
      }
    }
  }

  return unique(matches);
};

// ================================================================
// SYNC INSTITUTIONS FROM EXISTING USERS
// ================================================================

const syncInstitutionsFromUsers =
  async () => {
    const users =
      await User.find({
        university: {
          $exists: true,

          $nin: [
            '',
            null
          ]
        }
      }).select(
        'name email role university department skills expertise organization designation'
      );

    const grouped = {};

    for (
      const user of users
    ) {
      const university =
        String(
          user.university ||
            ''
        ).trim();

      if (!university) {
        continue;
      }

      if (!grouped[university]) {
        grouped[university] = {
          departments: [],
          expertise: [],
          technologies: [],
          keywords: []
        };
      }

      // Department
      if (user.department) {
        grouped[
          university
        ].departments.push(
          user.department
        );
      }

      // Skills
      if (
        Array.isArray(
          user.skills
        )
      ) {
        grouped[
          university
        ].expertise.push(
          ...user.skills
        );

        grouped[
          university
        ].technologies.push(
          ...user.skills
        );
      }

      // Expertise
      if (
        Array.isArray(
          user.expertise
        )
      ) {
        grouped[
          university
        ].expertise.push(
          ...user.expertise
        );

        grouped[
          university
        ].keywords.push(
          ...user.expertise
        );
      }
    }

    for (
      const [
        name,
        data
      ] of Object.entries(
        grouped
      )
    ) {
      await Institution.findOneAndUpdate(
        {
          name
        },

        {
          $set: {
            name,

            type:
              'University',

            departments:
              unique(
                data.departments
              ),

            expertise:
              unique(
                data.expertise
              ),

            technologies:
              unique(
                data.technologies
              ),

            keywords:
              unique(
                data.keywords
              ),

            source:
              'UserProfiles',

            isActive:
              true
          }
        },

        {
          upsert: true,

          new: true,

          setDefaultsOnInsert:
            true
        }
      );
    }

    return Object.keys(
      grouped
    ).length;
  };

// ================================================================
// GET STUDENT COUNT
// ================================================================

const getInstitutionStudentCount =
  async (
    institutionName
  ) => {
    if (!institutionName) {
      return 0;
    }

    return User.countDocuments({
      university:
        institutionName,

      role: 'student',

      isActive: {
        $ne: false
      }
    });
  };

// ================================================================
// MATCH INSTITUTIONS TO PROBLEM
// ================================================================

const matchInstitutionsToProblem =
  async (
    analysis,
    location = ''
  ) => {
    try {
      // ----------------------------------------------------------
      // First synchronize existing user universities
      // ----------------------------------------------------------

      await syncInstitutionsFromUsers();

      // ----------------------------------------------------------
      // Get institutions
      // ----------------------------------------------------------

      const institutions =
        await Institution.find({
          isActive: true
        }).lean();

      if (
        !institutions.length
      ) {
        return [];
      }

      // ----------------------------------------------------------
      // Problem data
      // ----------------------------------------------------------

      const problemCategory =
        normalize(
          analysis.category
        );

      const problemDisciplines =
        normalizeArray(
          analysis.disciplines
        );

      const problemTechnologies =
        normalizeArray(
          analysis.technologies
        );

      const problemKeywords =
        normalizeArray(
          analysis.keywords
        );

      const problemDepartments =
        normalizeArray(
          analysis.departments
        );

      const results = [];

      // ----------------------------------------------------------
      // Check each institution
      // ----------------------------------------------------------

      for (
        const institution of institutions
      ) {
        const institutionDepartments =
          normalizeArray(
            institution.departments
          );

        const institutionResearchAreas =
          normalizeArray(
            institution.researchAreas
          );

        const institutionExpertise =
          normalizeArray(
            institution.expertise
          );

        const institutionTechnologies =
          normalizeArray(
            institution.technologies
          );

        const institutionKeywords =
          normalizeArray(
            institution.keywords
          );

        // ------------------------------------------------------
        // Project information
        // ------------------------------------------------------

        const projectValues =
          [];

        if (
          Array.isArray(
            institution.projects
          )
        ) {
          for (
            const project of institution.projects
          ) {
            projectValues.push(
              project.title
            );

            projectValues.push(
              project.description
            );

            projectValues.push(
              project.category
            );
          }
        }

        // ------------------------------------------------------
        // Find department matches
        // ------------------------------------------------------

        const matchedDepartments =
          matchingValues(
            problemDepartments,

            institutionDepartments
          );

        // ------------------------------------------------------
        // Find discipline / research matches
        // ------------------------------------------------------

        const matchedDisciplines =
          matchingValues(
            problemDisciplines,

            [
              ...institutionDepartments,

              ...institutionResearchAreas,

              ...institutionExpertise
            ]
          );

        // ------------------------------------------------------
        // Find technology matches
        // ------------------------------------------------------

        const matchedTechnologies =
          matchingValues(
            problemTechnologies,

            [
              ...institutionTechnologies,

              ...institutionExpertise
            ]
          );

        // ------------------------------------------------------
        // Find keyword matches
        // ------------------------------------------------------

        const matchedKeywords =
          matchingValues(
            problemKeywords,

            [
              ...institutionKeywords,

              ...institutionResearchAreas,

              ...institutionExpertise,

              ...institutionTechnologies,

              ...projectValues
            ]
          );

        // ------------------------------------------------------
        // Calculate relevance
        // ------------------------------------------------------

        let score = 0;

        // Department relevance
        score += Math.min(
          matchedDepartments.length *
            12,

          24
        );

        // Discipline relevance
        score += Math.min(
          matchedDisciplines.length *
            12,

          30
        );

        // Technology relevance
        score += Math.min(
          matchedTechnologies.length *
            10,

          20
        );

        // Keyword relevance
        score += Math.min(
          matchedKeywords.length *
            5,

          20
        );

        // Location bonus
        if (
          location &&
          institution.location &&
          similarity(
            location,
            institution.location
          )
        ) {
          score += 5;
        }

        score = Math.min(
          Math.round(score),
          100
        );

        // ------------------------------------------------------
        // Ignore weak matches
        // ------------------------------------------------------

        if (score < 15) {
          continue;
        }

        // ------------------------------------------------------
        // Student count
        // ------------------------------------------------------

        const studentCount =
          await getInstitutionStudentCount(
            institution.name
          );

        // ------------------------------------------------------
        // Human-readable reasons
        // ------------------------------------------------------

        const reasons = [];

        if (
          matchedDepartments.length
        ) {
          reasons.push(
            `Relevant departments: ${matchedDepartments.join(
              ', '
            )}`
          );
        }

        if (
          matchedDisciplines.length
        ) {
          reasons.push(
            `Related research/discipline areas: ${matchedDisciplines.join(
              ', '
            )}`
          );
        }

        if (
          matchedTechnologies.length
        ) {
          reasons.push(
            `Matching technologies or skills: ${matchedTechnologies.join(
              ', '
            )}`
          );
        }

        if (
          matchedKeywords.length
        ) {
          reasons.push(
            `Related expertise/keywords: ${matchedKeywords.join(
              ', '
            )}`
          );
        }

        if (
          location &&
          institution.location &&
          similarity(
            location,
            institution.location
          )
        ) {
          reasons.push(
            'Institution location is relevant to the reported problem location.'
          );
        }

        // ------------------------------------------------------
        // Store result
        // ------------------------------------------------------

        results.push({
          institutionId:
            institution._id,

          name:
            institution.name,

          type:
            institution.type,

          location:
            institution.location ||
            '',

          website:
            institution.website ||
            '',

          matchScore:
            score,

          matchedAreas:
            unique([
              ...matchedDisciplines,

              ...matchedKeywords
            ]),

          matchedTechnologies,

          matchedDepartments,

          reasons,

          studentCount
        });
      }

      // ----------------------------------------------------------
      // Highest relevance first
      // ----------------------------------------------------------

      results.sort(
        (a, b) =>
          b.matchScore -
          a.matchScore
      );

      // ----------------------------------------------------------
      // Return top 10
      // ----------------------------------------------------------

      return results.slice(
        0,
        10
      );
    } catch (error) {
      console.error(
        'Institution matching error:',
        error
      );

      return [];
    }
  };

module.exports = {
  syncInstitutionsFromUsers,

  matchInstitutionsToProblem
};