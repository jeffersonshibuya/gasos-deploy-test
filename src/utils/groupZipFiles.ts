export default function GroupZipFiles(paths: string[]) {
  const tree: any = {};

  paths.forEach((path) => {
    const parts = path.split('/');
    let node = tree;

    parts?.forEach((part, index) => {
      if (!node[part]) {
        node[part] = {};
      }
      if (index === parts.length - 1) {
        node[part]._isFile = true;
      }
      node = node[part];
    });
  });

  console.log(tree);
  return tree;
}
