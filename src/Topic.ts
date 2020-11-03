/**
 * A topic can dispatch messages to its subscribers via its channel
 *
 */
import { MessageChannel } from './names'

export interface Topic {
  channel(): MessageChannel
}
