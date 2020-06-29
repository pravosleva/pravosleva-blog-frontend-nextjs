// 21 апр, чт
export const getFormatedDate = (inputDate) => {
  const monthNames = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сент', 'окт', 'нояб', 'дек']
  const dayNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
  const date = inputDate.getDate() < 10 ? `0${inputDate.getDate()}` : inputDate.getDate()
  const monthIndex = inputDate.getMonth()
  const dayIndex = inputDate.getDay()

  return `${date} ${monthNames[monthIndex]}, ${dayNames[dayIndex]}`
}

// 21 апр, 2020
export const getFormatedDate2 = (inputDate) => {
  const monthNames = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сент', 'окт', 'нояб', 'дек']
  const date = inputDate.getDate() < 10 ? `0${inputDate.getDate()}` : inputDate.getDate()
  const monthIndex = inputDate.getMonth()

  return `${date} ${monthNames[monthIndex]}, ${inputDate.getFullYear()}`
}

// 09.11.2020 в 18:15
export const getHoursMinutesBySeconds = (sec) => {
  const dt = new Date(sec * 10 ** 3)

  const hr = dt.getHours() < 10 ? `0${dt.getHours()}` : dt.getHours()
  const min = dt.getMinutes() < 10 ? `0${dt.getMinutes()}` : dt.getMinutes()

  return `${hr}:${min}`
}
export const formatDateBySeconds2 = (sec) => {
  const dt = new Date(sec * 10 ** 3)
  const monthNames = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const dateIndex = dt.getDate() < 10 ? `0${dt.getDate()}` : dt.getDate()
  const monthIndex = dt.getMonth()
  const year = String(dt.getFullYear()).substring(2, 4)

  return `${dateIndex}.${monthNames[monthIndex]}.${year} в ${getHoursMinutesBySeconds(sec)}`
}
