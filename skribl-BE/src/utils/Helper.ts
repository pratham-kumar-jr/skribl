export class Helper {
  public static generateRandomString(
    length = 9,
    options: {
      start?: string;
      includeUpperCase: boolean;
      includeLowerCase: boolean;
      includeNumbers: boolean;
      includeSpecialCharacters?: boolean;
    }
  ) {
    let text = options.start || "";
    const remainingLength = length - text.length;

    if (remainingLength <= 0) {
      return text;
    }

    let dictionary = "";

    if (options.includeLowerCase) {
      dictionary += "abcdefghijklmnopqrstuvwxyz";
    }

    if (options.includeUpperCase) {
      dictionary += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    if (options.includeNumbers) {
      dictionary += "1234567890";
    }

    if (options.includeSpecialCharacters) {
      dictionary += "!@#$%^&*()";
    }

    for (let i = 0; i < length; i++) {
      text += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
    }

    return text;
  }

  public static getRandom<T>(arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
}
