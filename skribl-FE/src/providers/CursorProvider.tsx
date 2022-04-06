import React, { useState, useEffect, ReactNode } from 'react'
import { canvasService } from '../services/CanvasService'
import { canvasStore } from '../store/CanvasStore'

export const CursorContext = React.createContext<string | ({ onCursor: (cursorType: string) => void; })>('cursorContext')

const SUPPORTED_CURSORS = ['default', 'eraser', 'pencil']

interface Props {
  children?: ReactNode,
}

const EraserCursor: React.FC<Props> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const cursor = canvasStore.Cursor;

  const onMouseMove = (event: MouseEvent) => {
    const { pageX: x, pageY: y } = event
    setMousePosition({ x, y })
  }

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
    }
  })

  const { x, y } = mousePosition

  const onCursor = (cursorType: string) => {
    cursorType = (SUPPORTED_CURSORS.includes(cursorType) && cursorType) || 'default'
    canvasService.selectCursor(cursorType);
  }
  
  return (
    <CursorContext.Provider value={{ onCursor }}>
      <ins
        className={`cursor ${cursor}`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      />
      {children}
    </CursorContext.Provider>
  )
}

EraserCursor.defaultProps = {}

export default React.memo(EraserCursor)
