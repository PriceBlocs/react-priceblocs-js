import chai from 'chai'
const { assert } = chai
import { ICheckoutItem } from '../../src/types'
import { checkoutAdd, checkoutRemove } from '../../src/form'
import * as sinon from 'sinon'
import { STUB_VALUES } from '../stubs'
import { cloneDeep } from 'lodash'

const sandbox = sinon.createSandbox()

describe('form', () => {
  beforeEach(() => {
    sandbox.restore()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('checkoutAdd', () => {
    it('update not called when price already present', () => {
      const setValuesSpy = sandbox.spy()

      const props = {
        values: cloneDeep(STUB_VALUES),
        setValues: setValuesSpy,
      }
      checkoutAdd(props)('p_A_1')

      assert.isNull(setValuesSpy.getCall(0))
    })

    it('adds new price', () => {
      const setValuesSpy = sandbox.spy()

      const props = {
        values: cloneDeep(STUB_VALUES),
        setValues: setValuesSpy,
      }
      checkoutAdd(props)('p_B_1')
      const touchedResult = setValuesSpy.getCall(0).args[0]
      const target = [
        {
          price: {
            id: 'p_A_1',
          },
        },
        {
          price: {
            id: 'p_B_1',
          },
        },
      ]
      assert.deepEqual(touchedResult.form.checkout.items, target)
    })
  })

  describe('checkoutRemove', () => {
    it('update not called when price not present', () => {
      const setValuesSpy = sandbox.spy()

      const props = {
        values: cloneDeep(STUB_VALUES),
        setValues: setValuesSpy,
      }
      checkoutRemove(props)('p_B_1')

      assert.isNull(setValuesSpy.getCall(0))
    })

    it('removes existing price', () => {
      const setValuesSpy = sandbox.spy()

      const props = {
        values: cloneDeep(STUB_VALUES),
        setValues: setValuesSpy,
      }
      checkoutRemove(props)('p_A_1')
      const touchedResult = setValuesSpy.getCall(0).args[0]
      const target = [] as ICheckoutItem[]
      assert.deepEqual(touchedResult.form.checkout.items, target)
    })
  })
})
