const { fairsayKnowledgeBase } = require("../data/fairsayKnowledgeBase");

function searchKnowledge(query) {
  const lowerQuery = query.toLowerCase();

  const matches = fairsayKnowledgeBase.filter(section =>
    section.keywords.some(keyword =>
      lowerQuery.includes(keyword.toLowerCase())
    )
  );

  if (!matches.length) {
    return `
        FairSay is a workplace rights and complaint support platform
        focused on Nigerian labour law and employee protection.

        If the user's question is not directly covered,
        provide general guidance based on Nigerian labour principles.
    `;
  }

  return matches.map(m => m.content).join("\n\n");
}

module.exports = { searchKnowledge };