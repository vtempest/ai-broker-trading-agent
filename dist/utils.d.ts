import { ClassValue } from 'clsx';
export declare function cn(...inputs: ClassValue[]): string;
/**
 * Adds variable state (like query, active tab. etc) to
 * the URL so that the state is preserved in a sharable URL
 * which when clicked resumes from those same state variables.
 * Pass in nothing to get the current URL state variables.
 *
 * @param {Record<string, string>} stateObject
 *   - The state object to sync to the URL like view: "search"
 * @param {boolean} addToBrowserHistory default false.
 *   - If true, add the new state to the browser history
 * @returns {Record<string, string>} stateObject
 *   - Always returns the current URL state object
 * @example
 *  let {view, q} = setStateInURL();
 *  setStateInURL({ view: "search" });
 */
export declare function setStateInURL(stateObject: Record<string, string> | null, addToBrowserHistory?: boolean): {
    [k: string]: string;
} | undefined;
