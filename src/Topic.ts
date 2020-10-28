/**
 * A topic
 *
 */
import { PrivateTopicName, TopicName } from './names'

export interface Topic {
  name(): TopicName | PrivateTopicName
}
