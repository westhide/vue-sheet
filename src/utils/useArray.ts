type ReplaceUnit<T> = [T, T];
export function arrayReplace<T>(target: T[], entries: ReplaceUnit<T>[]): void;
export function arrayReplace<T>(target: T[], formValue: T, toValue: T): void;

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

type FilterFn<T> = (value: T, index: number, array: T[]) => boolean;

export function reduceFilter<T>(target: T[], fns?: FilterFn<T>[]) {
  return fns ? fns.reduce((rows, fn) => rows.filter(fn), target) : target;
}
