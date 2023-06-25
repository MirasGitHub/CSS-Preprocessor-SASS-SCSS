"use strict";

const { src, dest, watch, series, task } = require("gulp");
const rename = require("gulp-rename");
const server = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const del = require("del");

task("css", function () {
	return src("src/scss/style.scss")
		.pipe(sass())
		.pipe(rename("style.css"))
		.pipe(dist("build/css"));
});

task("server", function () {
	server.init({
		server: "build/",
		notify: false,
		open: true,
		cors: true,
		ui: false,
	});

	watch("src/scss/**/*.scss", series("css"));
	watch("src/*.html", series("html", "refresh"));
});

task("images", function () {
	return src("src/assets/**/*.{png, jpg, svg}").pipe(dest("build/assets"));
});

task("html", function () {
	return src("src/*.html").pipe(dest("build"));
});

task("refresh", function (done) {
	server.reload();
	done();
});

task("clean", function () {
	return del("build");
});

task("build", series("clean", "css", "images", "html"));

task("start", series("build", "server"));
