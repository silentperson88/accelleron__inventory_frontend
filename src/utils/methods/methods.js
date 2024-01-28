// Remove key for values
export function filterObj(obj, values) {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === values) {
      delete newObj[key];
    }
  });

  return newObj;
}

// param creater from object
export function paramCreater(obj) {
  const filteredObject = filterObj(obj, "");
  const param = new URLSearchParams(filteredObject);
  return param;
}
