// /* global jest, beforeEach */
import CorrectCases from './CorrectCases'
import WrongCases from './WrongCases'
import { unregister } from '../../../unregister'

CorrectCases(unregister)
WrongCases(unregister)
