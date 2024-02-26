export const extract_function_festival = async () => {
  console.log('Extracting function festival');

  const artists = ['KYLE', 'Zach Zoya', 'Khanvict', 'Desiree Dawson', 'Dacey', 'Dilly Cooner'];
  let data: any[] = [];

  artists.forEach((name, index) => {
    data.push({
      artist: name,
      ticket_date: `Aug 19 @ Ship Point`,
      venue: 'Ship Point',
      date: 'Aug 19',
      popularity: index,
    });
  });

  return data;
};
