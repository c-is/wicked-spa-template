import { browserDetect } from '@app/utils/global';

const defaultStatus = {
  isLoaded: false,
  isAjaxActive: false,
  isMenuOpen: false,
  slug: null,
  page: null,
  current: null,
  view: null,
  pagePosition: 0,
  isMobile: browserDetect().mobile,
};

const defaultGlobals = {
  w: window.innerWidth,
  h: window.innerHeight,
  doc: document.documentElement,
};

const registry = {
  status: defaultStatus,
  globals: defaultGlobals,
  components: {},
  widgets: {},
};

export default {
  registerWidget,
  getWidget,
  getWidgetAll,
  registerComponent,
  resetComponent,
  getComponent,
  registerStatus,
  getStatus,
  getStatusAll,
  registerGlobal,
  getGlobal,
  getGlobalAll,
};

/**
 *  Widgets
 */

export function registerWidget(widgetName, widget) {
  registry.widgets[widgetName] = widget;
}

export function getWidget(widgetName) {
  const widget = registry.widgets[widgetName];
  if (!widget) {
    console.error(`${widgetName} doesn't exist!`);
  }

  return registry.widgets[widgetName];
}

export function getWidgetAll() {
  return registry.widgets;
}


/**
 *  Components
 */

export function registerComponent(componentName, component) {
  registry.components[componentName] = component;
}

export function resetComponent() {
  registry.components = {};
}

export function getComponent(componentName) {
  const component = registry.components[componentName];
  if (!component) {
    console.warn(`${componentName} doesn't exist!`);
  }

  return registry.components[componentName];
}


/**
 *  Status
 */

export function registerStatus(statusName, condition) {
  registry.status[statusName] = condition;
}

export function registerStatusAll(statuses) {
  registry.status = {
    ...registry.status,
    ...statuses,
  };
}

export function getStatus(statusName) {
  return registry.status[statusName];
}

export function getStatusAll() {
  return registry.status;
}


/**
 *  Globals
 */

export function registerGlobal(name, value) {
  registry.globals[name] = value;
}

export function getGlobal(name) {
  const globalValue = registry.globals[name];
  if (!globalValue) {
    console.error(`${name} doesn't exist!`);
  }

  return globalValue;
}

export function getGlobalAll() {
  return registry.globals;
}
