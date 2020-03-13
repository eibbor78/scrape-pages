declare module '*.sql' {
  const content: string
  export default content
}

declare module Chai {
  interface TypeComparison {
    equalQueryResult(expectedResult: any): Assertion
    haveEvent(event: string, expectedCount: number): Assertion
  }
}