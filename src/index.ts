import { createIdGenerator } from './idGenerator';

type Options = {
  alphabet?: string;
};

export type ClassNameMap = { [longName: string]: string };

export class CssShortener {
  private _map: ClassNameMap = {};
  private generateId: () => string;

  constructor(options?: Options) {
    this.generateId = createIdGenerator(options?.alphabet);
  }

  public get map(): ClassNameMap {
    return this._map;
  }

  /**
   * Imports mapped CSS class names
   * @param {object} map Map that should be imported
   * @param {boolean} override If true, existing mappings will be overridden
   */
  public importMap(map: ClassNameMap, override: boolean = false) {
    for (let classNameToImport in map) {
      if (this.isAlreadyUsed(map[classNameToImport]))
        throw new Error(
          `Cannot import class '${classNameToImport}'. Short class name '${map[classNameToImport]}' is already being used.`
        );
      if (this._map[classNameToImport] != null) {
        // Override mapped class name
        if (override === true)
          this._map[classNameToImport] = map[classNameToImport];
      } else this._map[classNameToImport] = map[classNameToImport]; // Import class name
    }
  }

  /**
   * Checks if the given class name is already used as a replacement for a longer class name
   * @param className class name to check for
   */
  private isAlreadyUsed(className: string): boolean {
    return Object.values(this.map).includes(className);
  }

  /**
   * Generates and maps a new class name
   * @param className The existing class name that should be replaced
   * @returns {string} The new generated and mapped class name
   */
  public shortenClassName(className: string) {
    // Return the already mapped class name
    if (this._map[className] != null) return this._map[className];
    // Generate, map and return the new class name
    let newClassName = this.generateId();
    while (this.isAlreadyUsed(newClassName)) {
      newClassName = this.generateId();
    }
    return (this._map[className] = newClassName);
  }
}
