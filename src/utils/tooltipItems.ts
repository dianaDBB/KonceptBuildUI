import { Configs, EntityType } from '@/types/entity-configs';

export function buildTooltipItems<TEntity extends EntityType>(entity: TEntity, configs: Configs<any, TEntity>) {
  return Object.values(configs).map((config) => ({
    label: config.label,
    value: config.displayValue(entity),
  }));
}
