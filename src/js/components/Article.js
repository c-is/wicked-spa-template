import Component from './Component';

export default class Article extends Component {
  constructor($view, options) {
    super($view);

    this.$view = $view;
    this.options = options;

    this.render();
  }

  render() {
    this.events();
  }

  events() {}
}

Component.Article = Article;
