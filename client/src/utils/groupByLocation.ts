export const groupByLocation = (locations: any) => {
  const groups: any = [];

  locations.forEach((location: any) => {
    const { location: group } = location;

    // Find the group in the existing groups array
    const groupIndex = groups.findIndex(
      (groupObj: any) => groupObj.location === group,
    );

    if (groupIndex === -1) {
      // If the group doesn't exist, create a new group object
      const newGroup = {
        location: group,
        locations: [location],
      };
      groups.push(newGroup);
    } else {
      // If the group already exists, add the location to its locations array
      groups[groupIndex].locations.push(location);
    }
  });

  return groups;
};
