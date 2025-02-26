function gen(...args) {
  let list = [];
  for (const arg of args) {
    list.push(arg);
  }
  return JSON.stringify(list);
}

function breadcrumb(...args) {
  let list = [];
  let i = 1;
  for (const arg of args) {
    list.push({
      '@type': 'ListItem',
      position: i,
      name: arg.name,
      item: arg.item,
    });
    i++;
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list,
  };
}

export default {
  gen: gen,
  breadcrumb: breadcrumb,
};
