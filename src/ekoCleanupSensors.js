import { KeyboardSensor, PointerActivationConstraints, PointerSensor } from '@dnd-kit/dom'

export function cleanupActivationConstraints(event, source) {
  if (event.pointerType === 'touch' && window.matchMedia('(max-width: 768px)').matches) {
    return [new PointerActivationConstraints.Distance({ value: 2 })]
  }
  return PointerSensor.defaults.activationConstraints(event, source)
}

export const cleanupSensors = [
  PointerSensor.configure({ activationConstraints: cleanupActivationConstraints }),
  KeyboardSensor,
]
