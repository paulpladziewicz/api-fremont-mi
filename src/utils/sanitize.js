//function to remove xss
function xss(str) {
  return str.replace(/[<>]/g, '');
}
//function to remove html tags
function html(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, '');
}

const sanitize = (input) => {
  if (typeof input === 'string') {
    return xss(html(input));
  }

  return input;
};

export default sanitize;
