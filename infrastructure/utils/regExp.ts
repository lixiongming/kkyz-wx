type RegexPattern = RegExp;
export const pwd:RegexPattern = /^(?!.*\s)(?=.*[A-Za-z])(?=.*[\d@$!%*?&]).{6,20}$|^(?!.*\s)(?=.*[\d])(?=.*[@$!%*?&]).{6,20}$|^(?!.*\s)(?=.*[A-Za-z])(?=.*[\d]).{6,20}$/