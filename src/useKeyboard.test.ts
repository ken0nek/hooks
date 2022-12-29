import {useKeyboard} from './useKeyboard'
import {act, renderHook} from '@testing-library/react-hooks'
import {Keyboard, KeyboardEventName} from 'react-native'

type Coordinates = {
  screenX: number
  screenY: number
  width: number
  height: number
}

describe('useKeyboard', () => {
  const mockCoords = {screenX: 0, screenY: 0, width: 0, height: 0}
  const emitKeyboardEvent = ({
    eventType,
    startCoordinates = mockCoords,
    endCoordinates = mockCoords,
  }: {
    eventType: KeyboardEventName
    startCoordinates?: Coordinates
    endCoordinates?: Coordinates
  }) => {
    const mockEvent = {startCoordinates, endCoordinates}

    Keyboard.emit(eventType, eventType === 'keyboardDidHide' ? null : mockEvent)
  }

  describe('setKeyboardHeight: number', () => {
    it('keyboard height is zero by default', () => {
      const {result} = renderHook(() => useKeyboard())

      expect(result.current.keyboardHeight).toBe(0)
    })

    it('should update keyboard height when keyboard will open', () => {
      const height = 123
      const {result} = renderHook(() => useKeyboard())

      act(() => {
        emitKeyboardEvent({
          eventType: 'keyboardDidShow',
          endCoordinates: {...mockCoords, height},
        })
      })

      expect(result.current.keyboardHeight).toBe(height)
    })

    it('should reset keyboard height when keyboard will close', () => {
      const height = 123
      const {result} = renderHook(() => useKeyboard())

      act(() => {
        emitKeyboardEvent({
          eventType: 'keyboardDidShow',
          endCoordinates: {...mockCoords, height},
        })
      })

      expect(result.current.keyboardHeight).toBe(height)

      act(() => {
        emitKeyboardEvent({eventType: 'keyboardDidHide'})
      })

      expect(result.current.keyboardHeight).toBe(0)
    })

    it('should update keyboard height when keyboard changes frame', () => {
      const height = 123
      const {result} = renderHook(() => useKeyboard())

      act(() => {
        emitKeyboardEvent({
          eventType: 'keyboardDidShow',
          endCoordinates: {...mockCoords, height},
        })
      })

      expect(result.current.keyboardHeight).toBe(height)

      const willChangeFrameHeight = 124

      act(() => {
        emitKeyboardEvent({
          eventType: 'keyboardWillChangeFrame',
          endCoordinates: {...mockCoords, height: willChangeFrameHeight},
        })
      })

      expect(result.current.keyboardHeight).toBe(willChangeFrameHeight)

      const didChangeFrameHeight = 125

      act(() => {
        emitKeyboardEvent({
          eventType: 'keyboardDidChangeFrame',
          endCoordinates: {...mockCoords, height: didChangeFrameHeight},
        })
      })

      expect(result.current.keyboardHeight).toBe(didChangeFrameHeight)
    })
  })

  describe('keyboardShown: boolean', () => {
    it('keyboard closed by default', () => {
      const {result} = renderHook(() => useKeyboard())

      expect(result.current.keyboardShown).toBe(false)
    })

    it('should set keyboardShown when keyboard will open', () => {
      const {result} = renderHook(() => useKeyboard())
      const {keyboardShown: initial} = result.current

      act(() => {
        emitKeyboardEvent({eventType: 'keyboardDidShow'})
      })

      const {keyboardShown: afterOpen} = result.current

      expect({initial, afterOpen}).toEqual({initial: false, afterOpen: true})
    })

    it('should reset keyboardShown when keyboard will close', () => {
      const {result} = renderHook(() => useKeyboard())
      const {keyboardShown: initial} = result.current

      act(() => {
        emitKeyboardEvent({eventType: 'keyboardDidShow'})
      })

      const {keyboardShown: afterOpen} = result.current

      act(() => {
        emitKeyboardEvent({eventType: 'keyboardDidHide'})
      })

      const {keyboardShown: afterClose} = result.current

      expect({initial, afterOpen, afterClose}).toEqual({
        initial: false,
        afterOpen: true,
        afterClose: false,
      })
    })
  })
})
