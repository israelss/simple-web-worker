/* global jest */
import CorrectCases from './CorrectCases'
import WrongCases from './WrongCases'
import { create } from '../../../create'

jest.spyOn(console, 'error')

CorrectCases(create)
WrongCases(create)
