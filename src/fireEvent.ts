import { LitElement } from 'lit-element'
import { HAEvent, LooseObject } from './types'

export default function fireEvent(
  node: LitElement,
  type: string,
  detail: string | LooseObject,
  options: LooseObject = {}
): HAEvent {
  options = options || {}
  detail = detail === null || detail === undefined ? {} : detail
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
  }) as HAEvent
  event.detail = detail
  node.dispatchEvent(event)
  return event
}
