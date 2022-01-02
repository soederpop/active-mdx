#!/bin/sh

rm -rf $PWD/workspaces/desktop
mkdir -p $PWD/workspaces/desktop
cp -r $PWD/packages/desktop/src $PWD/workspaces/desktop 
cp -r $PWD/packages/desktop/resources $PWD/workspaces/desktop 
cp -r $PWD/packages/desktop/.gitignore $PWD/workspaces/desktop 
cp $PWD/packages/desktop/*.js $PWD/workspaces/desktop
cp $PWD/packages/desktop/*.ts $PWD/workspaces/desktop
cp $PWD/packages/desktop/*.yaml $PWD/workspaces/desktop
cp $PWD/packages/desktop/*.json $PWD/workspaces/desktop
cd $PWD/workspaces/desktop && yarn && yarn build && yarn package
