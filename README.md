
# fs-force-mkdir

## Requirements

 * Node >= 6.0.0

## Usage

```javascript
var writeFile = require('fs-force-write-file');
writeFile('./a/b/c/d', 'Hello, World!!', (error, info) => {
    if (error) {
        console.error('Failed', error);
    } else {
        console.log('Succeed', info);
    }
});
```

The code above would:
 * First, do [`force-mkdir`](https://www.npmjs.com/package/fs-force-mkdir) to create a directory `'./a/b/c'`
 * Then, do [`fs.writeFile`](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback) to create file `'./a/b/c/d'` with content `'Hello, World!!'`

## License

[MIT](https://github.com/ksxnodemodules/my-licenses/blob/master/MIT.md) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
