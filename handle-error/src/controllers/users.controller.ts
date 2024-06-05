function httpSignUp() {
  throw new Error();
}

function httpSignIn() {
  throw new Error('Bad Request');
}

function httpSignOut() {
  throw new Error('Another bad request');
}

export { httpSignUp, httpSignIn, httpSignOut};
