VERSION="$(cat manifest.json | grep "\"version\"" | tr -d ' ' | cut -d":" -f2 | tr -d "\"" | tr -d ",")"
echo $VERSION
cd "$HOME" && zip -r "webpagestickynotes-$VERSION.zip" webpagestickynotes