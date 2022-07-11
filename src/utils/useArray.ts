type ReplaceUnit<T> = [T, T];
export function arrayReplace<T>(target: T[], replace: ReplaceUnit<T>[]): void;
export function arrayReplace<T>(target: T[], replace: T, toValue: T): void;

export function arrayReplace<T>(target: T[], replace: unknown, toValue?: T) {
  target.forEach((value, index) => {
    if (isArray<ReplaceUnit<T>>(replace)) {
      replace.forEach((row) => {
        if (value === row[0]) {
          target[index] = row[1];
        }
      });
      return;
    }

    if (replace === target[index]) {
      target[index] = toValue!;
    }
  });
}
