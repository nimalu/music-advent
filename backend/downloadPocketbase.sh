#!/bin/sh

release="https://github.com/pocketbase/pocketbase/releases/download/v0.19.1/pocketbase_0.19.1_linux_amd64.zip"

target_dir="./pocketbase-release"

mkdir -p "$target_dir"

wget "$release" -O "pb.zip"
unzip "pb.zip" -d "$target_dir"
rm "pb.zip"

mv "$target_dir/pocketbase" "./"
rm -r "$target_dir"
