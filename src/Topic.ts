/**
 * A topic can dispatch messages to its subscribers via its channel
 *
 */
import { MessageChannel } from './channels'

export interface Topic {
  channel(): MessageChannel
}
