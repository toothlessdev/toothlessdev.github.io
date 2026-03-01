import fs from 'fs';
import path from 'path';

const postsRoot = path.join(process.cwd(), 'contents/posts');

async function migrateAll() {
  const categories = fs.readdirSync(postsRoot, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const category of categories) {
    const categoryPath = path.join(postsRoot, category);
    
    // 1. 카테고리 루트에 있는 마크다운 파일 이동 (아직 이동 안 된 것들)
    const files = fs.readdirSync(categoryPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && file.name.endsWith('.md') && file.name !== 'index.md') {
        const postName = path.basename(file.name, '.md');
        const postDirPath = path.join(categoryPath, postName);
        if (!fs.existsSync(postDirPath)) fs.mkdirSync(postDirPath);
        fs.renameSync(path.join(categoryPath, file.name), path.join(postDirPath, 'index.md'));
      }
    }

    // 2. 포스트별 이미지 이동 및 경로 수정
    const postDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name !== 'img')
      .map(dirent => dirent.name);

    for (const postDir of postDirs) {
      const postDirPath = path.join(categoryPath, postDir);
      const indexPath = path.join(postDirPath, 'index.md');
      if (!fs.existsSync(indexPath)) continue;

      let content = fs.readFileSync(indexPath, 'utf-8');
      
      // ![...](./img/some-folder/...) 형태 찾기
      const imgPattern = /!\[.*?\]\(\.\/img\/(.*?)\/.*?\)/g;
      const matches = [...content.matchAll(imgPattern)];

      if (matches.length > 0) {
        const imgFolderName = matches[0][1];
        const oldImgDirPath = path.join(categoryPath, 'img', imgFolderName);
        const newImgDirPath = path.join(postDirPath, 'img');

        console.log(`Processing: ${category}/${postDir} (img folder: ${imgFolderName})`);

        if (fs.existsSync(oldImgDirPath)) {
          if (!fs.existsSync(newImgDirPath)) fs.mkdirSync(newImgDirPath);
          const images = fs.readdirSync(oldImgDirPath);
          for (const img of images) {
            fs.renameSync(path.join(oldImgDirPath, img), path.join(newImgDirPath, img));
          }
          try { fs.rmdirSync(oldImgDirPath); } catch (e) {}
        }

        // 경로 수정: ./img/folder/ -> ./img/
        const replacePattern = new RegExp(`\./img/${imgFolderName}/`, 'g');
        content = content.replace(replacePattern, './img/');
        fs.writeFileSync(indexPath, content, 'utf-8');
      } else {
          // 이미 ./img/로 되어 있는 경우 (이미 이미지가 옮겨졌을 수도 있음)
          const newImgDirPath = path.join(postDirPath, 'img');
          // 만약 포스트 폴더 바로 밑에 img가 없는데, 카테고리 밑 img 폴더 이름이 포스트 이름과 같다면?
          const guessedOldImgDir = path.join(categoryPath, 'img', postDir);
          if (fs.existsSync(guessedOldImgDir) && !fs.existsSync(newImgDirPath)) {
              console.log(`Guessing img folder for ${postDir}: ${postDir}`);
              fs.mkdirSync(newImgDirPath);
              const images = fs.readdirSync(guessedOldImgDir);
              for (const img of images) {
                fs.renameSync(path.join(guessedOldImgDir, img), path.join(newImgDirPath, img));
              }
              try { fs.rmdirSync(guessedOldImgDir); } catch (e) {}
          }
      }
    }
    
    // 3. 남은 img 폴더 정리 (비어 있는 경우만)
    const catImgDir = path.join(categoryPath, 'img');
    if (fs.existsSync(catImgDir) && fs.readdirSync(catImgDir).length === 0) {
        fs.rmdirSync(catImgDir);
    }
  }
}

migrateAll().catch(console.error);
