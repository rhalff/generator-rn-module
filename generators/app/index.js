const Base = require('yeoman-generator')
const stringUtils = require('./string-utils')
const mkdirp = require('mkdirp')
const gitUser = require('./git-user')
const os = require('os')

class RNModuleGenerator extends Base {
  prompting() {
    const appName = stringUtils.camelize(this.appname)
    const user = gitUser()
    const username = os.userInfo().username

    return this.prompt([
      {
        type    : 'input',
        name    : 'username',
        message : 'Username',
        default : username
      },
      {
        type    : 'input',
        name    : 'author',
        message : 'Author',
        default : user ? user.name : 'John Doe'
      },
      {
        type    : 'input',
        name    : 'appName',
        message : 'NPM Package Name (dashed)',
        default : appName
      },
      {
        type    : 'input',
        name    : 'moduleName',
        message : 'Your module name',
        default : stringUtils.capitalizeFirstLetter(appName),
      },
      {
        type    : 'input',
        name    : 'reactMethodName',
        message : 'Your first react method name',
        default : appName,
      },
      {
        type    : 'input',
        name    : 'reactNativeVersion',
        message : 'The react native version you want to use',
        default : '0.14.+',
      },
      {
        type    : 'input',
        name    : 'packageName',
        message : 'Your Android module package name',
        default : 'org.example.' + appName.toLowerCase(),
      },
    ]).then((answers) => {
      this.answers = {}

      for (let key in answers) {
        if (answers.hasOwnProperty(key)) {
          this.answers[key] = answers[key]
          this.answers[stringUtils.capitalizeFirstLetter(key)] = answers[key]
        }
      }
    });
  }

  writing() {
    this._writeAndroidPart(this.answers)
    this._copyExampleFiles(this.answers)
    this._copySrc(this.answers)
    this._copyScripts(this.answers)
    this._copyHidden(this.answers)
    this._copyLicense(this.answers)
    this._copyReadme(this.answers)
    this._copyPackageJson(this.answers)
    // this._writeIOSPart(this.answers)
  }

  _setupAndroidPackageFolders(packageName) {
    const packageFolders = packageName.split('.')
    let currentFolder = './android/src/main/java/'

    if (packageFolders.length === 3) {
      packageFolders.forEach((packageFolder) => {
        mkdirp.sync(currentFolder + packageFolder)
        currentFolder += packageFolder + '/'
      })

      return currentFolder
    }

    throw Error('Expected packageName to contain 3 segments.')
  }

  _writeAndroidPart(vars) {
    const packageFolder = this._setupAndroidPackageFolders(vars.packageName)

    this.fs.copyTpl(
      this.templatePath('android/AndroidManifest.xml'),
      this.destinationPath('android/src/main/AndroidManifest.xml'),
      vars
    )

    this.fs.copyTpl(
      this.templatePath('android/build.gradle'),
      this.destinationPath('android/build.gradle'),
      vars
    )

    this.fs.copyTpl(
      this.templatePath('android/Module.java'),
      packageFolder + vars.moduleName + 'Module.java',
      vars
    )

    this.fs.copyTpl(
      this.templatePath('android/ReactPackage.java'),
      packageFolder + vars.moduleName + 'ReactPackage.java',
      vars
    )
  }

  _copyReadme(vars) {
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      vars
    )
  }

  _copyPackageJson(vars) {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      vars
    )
  }

  _copyLicense(vars) {
    this.fs.copyTpl(
      this.templatePath('LICENSE'),
      this.destinationPath('LICENSE'),
      vars
    )
  }

  _copyHidden(vars) {
    this.fs.copyTpl(
      this.templatePath('\.*'),
      this.destinationPath(''),
      vars
    )
  }

  _copySrc(vars) {
    this.fs.copyTpl(
      this.templatePath('src/**/*.js'),
      this.destinationPath('src/'),
      vars
    )
  }

  _copyScripts(vars) {
    this.fs.copyTpl(
      this.templatePath('scripts/*.sh'),
      this.destinationPath('scripts/'),
      vars
    )
  }

  _copyExampleFiles(vars) {
    const copyOnlyExtensions = 'jar|png';
    const extensionLess = 'BUCK|gradlew|Podfile';

    this.fs.copyTpl(
      this.templatePath(`example/**/*.!(${copyOnlyExtensions})`),
      this.destinationPath('example/'),
      vars
    )
    this.fs.copy(
      this.templatePath(`example/**/*.+(${copyOnlyExtensions})`),
      this.destinationPath('example/')
    )
    this.fs.copy(
      this.templatePath(`example/**/*(${extensionLess})`),
      this.destinationPath('example/')
    )
  }

  _writeIOSPart(generator) {
    generator.copy('ios/index.ios.js', 'index.ios.js')

    const iosFiles = [
      'ios/RCTModule/RCTModule.h',
      'ios/RCTModule/RCTModule.m',
      'ios/RCTModule.xcodeproj/project.pbxproj'
    ]

    iosFiles.forEach((iosFile) => {
      generator.copy(iosFile, iosFile.replace(/Module/g, generator.moduleName))
    })
  }
}

module.exports = RNModuleGenerator
