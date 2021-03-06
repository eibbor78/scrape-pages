import { expect } from 'chai'
import { dslParser } from '../'
import { syntaxCoverageInstruction } from './fixtures/expected-parse-results'
import { typecheckInstructions } from '@scrape-pages/types/runtime-typechecking'

const instructions = `
# hi
INPUT 'hi'
(
  FETCH 'https://google.com' METHOD="GET" WRITE=true

  # another comment

  FETCH 'https://wikipedia.com' WRITE=true READ=true
  PARSE 'span > a' ATTR="href" MAX=10 LABEL="test"
).until('{{value}}' == 'x' || ('{{index}}' <= 2))
.map(
   # comment
).merge(
 (
   FETCH 'me' METHOD="PUT"
   FETCH 'me'
 ).map(
   FETCH 'you'
 )
)
`

// TODO add leaf operator
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const instructionsWithLeaves = `
(
  POST 'https://google.com/login' LABEL='login'
).leaf(
  GET 'https://google.com/settings'
).leaf(
  GET 'https://google.com/photos'
).map(
# I'm working with 'login' value

)
`

//// save contextual values brainstorming:
//const saveUsingOperator = `
//(
//  FETCH 'http://auth-tokens/login' METHOD='POST' BODY={"username": "alice", "password": "abc" }
//).saveValue('token').map(
//  FETCH 'http://auth-tokens/users/alice' HEADERS={"http-x-auth-token": "{{ token }}"}
//  FETCH 'http://auth-tokens/users/alice/likes' HEADERS={"http-x-auth-token": "{{ token }}"}
//)
//`
//const saveUsingMacros = `
//MACRO 'auth-fetch' FETCH HEADERS={"http-x-auth-token": "{{token}}"}
//(
//  FETCH 'http://auth-tokens/login' METHOD='POST' BODY={"username": "alice", "password": "abc"}
//  PARSE 'auth_token' FORMAT='json'
//  SET 'token'
//  MACRO_ENABLE 'auth-fetch'
//  FETCH 'http://auth-tokens/users/alice' HEADERS={"http-x-auth-token": "{{ token }}"}
//  FETCH 'http://auth-tokens/users/alice/likes' HEADERS={"http-x-auth-token": "{{ token }}"}
//  MACRO_DISABLE 'auth-fetch'
//  PARSE 'likes' LABEL='likes' FORMAT='json'
//)
//`
//
//MACRO FETCH_AUTHED = FETCH HEADERS={"http-x-auth-token": "{{token}}"}
//(
//  FETCH 'http://auth-tokens/login' METHOD='POST' BODY={"username": "alice", "password": "abc"}
//  PARSE 'auth_token' FORMAT='json'
//  SET 'token'
//  FETCH_AUTHED 'http://auth-tokens/users/alice'
//  FETCH_AUTHED 'http://auth-tokens/users/alice/likes'
//  PARSE 'likes' LABEL='likes' FORMAT='json'
//)

describe(__filename, () => {
  describe('instruction set covering all syntax', () => {
    it('should match expected output', () => {
      const parsedInstructions = dslParser(instructions)
      expect(parsedInstructions).to.be.deep.equal(syntaxCoverageInstruction)
    })

    it('should match the Instruction type', () => {
      const parsedInstructions = dslParser(instructions)
      expect(() => typecheckInstructions(parsedInstructions)).to.not.throw()
    })
  })
})
