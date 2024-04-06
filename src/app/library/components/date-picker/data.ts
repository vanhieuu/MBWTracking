export function generateMonths(language:string) {
    const months = [
      { value: 1, vnName: "Tháng 1", engName: "January" },
      { value: 2, vnName: "Tháng 2", engName: "February" },
      { value: 3, vnName: "Tháng 3", engName: "March" },
      { value: 4, vnName: "Tháng 4", engName: "April" },
      { value: 5, vnName: "Tháng 5", engName: "May" },
      { value: 6, vnName: "Tháng 6", engName: "June" },
      { value: 7, vnName: "Tháng 7", engName: "July" },
      { value: 8, vnName: "Tháng 8", engName: "August" },
      { value: 9, vnName: "Tháng 9", engName: "September" },
      { value: 10, vnName: "Tháng 10", engName: "October" },
      { value: 11, vnName: "Tháng 11", engName: "November" },
      { value: 12, vnName: "Tháng 12", engName: "December" }
    ];
  
    return language === 'vi' ? months.map(month => ({ value: month.value, name: month.vnName })) :
      language === 'en' ? months.map(month => ({ value: month.value, name: month.engName })) :
      months;
  }
  
 export  function generateDaysArray(month:any, year:any) {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  }
  
  export function generateYears(startYear:any, endYear:any) {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  }