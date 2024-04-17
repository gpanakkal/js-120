/**
 * 1. Function.prototype.bind(context, ...args)
 * 2. Nothing, because bind doesn't execute the calling function.
 * 3. On line 12 it logs NaN, and on line 13 it logs 5.
 *    In strict mode, line 12 causes a TypeError to be raised for an invalid prop access
 *    since the global object is set to undefined
 * 4. It logs 'JavaScript makes sense!' because the execution context of the bound function
 *    is fixed to `positivity`.
 * 5. It logs 'Amazebulous!' because .call() cannot alter the execution context of a bound
 *    function.
 */
