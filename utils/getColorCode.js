module.exports = async (member) => {
    if (!member || !member.roles || !member.roles.cache) return null;

    const colorRole = member.roles.cache
        .filter(role => role.color !== 0)
        .sort((a, b) => b.position - a.position) 
        .first(); 

    return colorRole || null; 
}