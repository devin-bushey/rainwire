export const filterRecent = (data: any) => {
  return data.filter((ticket: any) => {
    const sevenDaysAgo: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const ticketDate = new Date(ticket.date);
    return ticketDate > sevenDaysAgo;
  });
};
