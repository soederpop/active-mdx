#!/bin/sh

ROOT = $CWD
mkdir -p $ROOT/workspaces
if [ ! -f $ROOT/workspaces/active-mdx-software-project-starter ]
then
    cd $ROOT/workspaces && git clone git@github.com:soederpop/active-mdx-software-project-starter.git
else
    echo "Copying to Software Project Starter"
fi

cp -r $ROOT/packages/software-project-demo-site/* $ROOT/workspaces/active-mdx-software-project-starter/

cd $ROOT/workspaces/active-mdx-software-project-starter
git add .
git commit -m "Syncing with monorepo"
git push origin