import { KnowledgeFormFeature } from '../features/KnowledgeFormFeature.js';

export function getNewKnowledgeController() {
  return <KnowledgeFormFeature action="/knowledges" title="ナレッジ作成" />;
}
