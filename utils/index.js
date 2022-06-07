export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        time = parseInt(time);
      } else {
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }

    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const weekList = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const time_str = format.replace(/{([ymdhisaM])+}/g, (result, key) => {
    const value = formatObj[key];
    if (key === "a") {
      return weekList[value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}
