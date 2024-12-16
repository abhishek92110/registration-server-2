const mongoose = require('mongoose');
const { Schema } = mongoose;



const setDate = (dateString) => {
    const dateParts = dateString.split(' ');
    const day = parseInt(dateParts[0]);
    const month = dateParts[1];
    const year = parseInt(dateParts[2]);
    const monthsMap = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11
    };
    const monthIndex = monthsMap[month];
  
    return new Date(year, monthIndex, day);
  }
  const getDate = (date) => {
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const monthsList = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthsList[monthIndex];
  
    return `${day} ${month} ${year}`;
  };


  const DataModel = mongoose.models.studentlists || mongoose.model('studentlists', new mongoose.Schema({
    JoiningDate: {
      type: String,
      set: setDate, // Custom setter function
      get: getDate // Custom getter function
    }
  }));

module.exports = DataModel;