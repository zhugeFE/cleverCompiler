/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80025
 Source Host           : localhost:3306
 Source Schema         : clever_compile

 Target Server Type    : MySQL
 Target Server Version : 80025
 File Encoding         : 65001

 Date: 17/11/2021 17:35:11
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for compile
-- ----------------------------
DROP TABLE IF EXISTS `compile`;
CREATE TABLE `compile` (
  `id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `compile_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '编译时间',
  `compile_user` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '编译用户',
  `compile_result` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '编译结果',
  `project_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '编译项目id',
  `description` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '描述',
  `file` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '文件地址',
  `config` text CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '配置文件',
  PRIMARY KEY (`id`),
  KEY `compile_ibfk_1` (`compile_user`),
  KEY `compile_ibfk_2` (`project_id`),
  CONSTRAINT `compile_ibfk_1` FOREIGN KEY (`compile_user`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `compile_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for config_type
-- ----------------------------
DROP TABLE IF EXISTS `config_type`;
CREATE TABLE `config_type` (
  `id` int NOT NULL,
  `label` varchar(100) DEFAULT NULL COMMENT '类型描述',
  `key` varchar(10) DEFAULT NULL COMMENT '英文标识',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='文本、文件替换、json';

-- ----------------------------
-- Table structure for customer
-- ----------------------------
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '客户名称',
  `description` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '描述',
  `creator_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '创建者id',
  `tel` varchar(11) DEFAULT NULL COMMENT '联系方式',
  PRIMARY KEY (`id`),
  KEY `customer_ibfk_2` (`creator_id`),
  CONSTRAINT `customer_ibfk_2` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='客户表';

-- ----------------------------
-- Table structure for git_source
-- ----------------------------
DROP TABLE IF EXISTS `git_source`;
CREATE TABLE `git_source` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(50) DEFAULT NULL COMMENT '源名称',
  `description` text COMMENT '库描述信息',
  `git` varchar(100) DEFAULT NULL COMMENT 'git地址',
  `enable` tinyint(1) DEFAULT '1' COMMENT '是否启用为源',
  `git_id` int DEFAULT NULL COMMENT 'git库中的id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='git源\n会将当前git账号有权限的所有git库都导入进来';

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` varchar(50) NOT NULL DEFAULT '' COMMENT '工程id',
  `name` varchar(100) DEFAULT NULL COMMENT '配置名称',
  `template_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '模板id',
  `template_version` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '模板版本',
  `compile_type` int DEFAULT NULL COMMENT '编译类型。0：私有部署；1：常规迭代；2：发布测试',
  `public_type` int DEFAULT NULL COMMENT '发布方式。0：发布到git；1：下载；2：自动',
  `description` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '描述',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `customer` varchar(50) DEFAULT NULL COMMENT '客户id',
  `receive_user_id` text COMMENT '被分享的成员id',
  `creator_id` varchar(50) DEFAULT NULL COMMENT '创建者id',
  PRIMARY KEY (`id`),
  KEY `project_ibfk_1` (`template_id`),
  KEY `project_ibfk_2` (`template_version`),
  KEY `project_ibfk_3` (`customer`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `template` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `project_ibfk_2` FOREIGN KEY (`template_version`) REFERENCES `template_version` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `project_ibfk_3` FOREIGN KEY (`customer`) REFERENCES `customer` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='项目表。';

-- ----------------------------
-- Table structure for project_config
-- ----------------------------
DROP TABLE IF EXISTS `project_config`;
CREATE TABLE `project_config` (
  `id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `target_value` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '默认值',
  `global_config_id` varchar(50) DEFAULT NULL COMMENT '全局配置id',
  `project_git_id` varchar(50) DEFAULT NULL COMMENT '项目git',
  `template_config_id` varchar(50) DEFAULT NULL COMMENT '配置局部id',
  PRIMARY KEY (`id`),
  KEY `project_config_ibfk_3` (`global_config_id`),
  KEY `proejct_config_ibfk_4` (`project_git_id`),
  KEY `project_config_ibfk_4` (`template_config_id`),
  CONSTRAINT `proejct_config_ibfk_4` FOREIGN KEY (`project_git_id`) REFERENCES `project_git` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `project_config_ibfk_3` FOREIGN KEY (`global_config_id`) REFERENCES `project_global_config` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `project_config_ibfk_4` FOREIGN KEY (`template_config_id`) REFERENCES `template_config` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='编译项目配置';

-- ----------------------------
-- Table structure for project_git
-- ----------------------------
DROP TABLE IF EXISTS `project_git`;
CREATE TABLE `project_git` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `project_id` varchar(50) DEFAULT NULL COMMENT '项目id',
  `template_git_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_git_ibfk_3` (`project_id`),
  KEY `project_git_ibfk_1` (`template_git_id`),
  CONSTRAINT `project_git_ibfk_1` FOREIGN KEY (`template_git_id`) REFERENCES `template_version_git` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `project_git_ibfk_3` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for project_global_config
-- ----------------------------
DROP TABLE IF EXISTS `project_global_config`;
CREATE TABLE `project_global_config` (
  `id` varchar(50) NOT NULL DEFAULT '' COMMENT '配置项id',
  `project_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '工程id',
  `target_value` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `template_global_config_id` varchar(50) DEFAULT NULL COMMENT '模版全局配置id',
  PRIMARY KEY (`id`),
  KEY `project_global_config_ibfk_2` (`project_id`),
  KEY `project_global_config_ibfk_3` (`template_global_config_id`),
  CONSTRAINT `project_global_config_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `project_global_config_ibfk_3` FOREIGN KEY (`template_global_config_id`) REFERENCES `template_global_config` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL COMMENT '角色名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for source_config
-- ----------------------------
DROP TABLE IF EXISTS `source_config`;
CREATE TABLE `source_config` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `source_id` varchar(50) DEFAULT NULL COMMENT '源id',
  `version_id` varchar(50) DEFAULT NULL COMMENT '版本id',
  `description` text CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '配置项描述',
  `reg` varchar(200) DEFAULT NULL COMMENT '配置项正则',
  `type_id` int DEFAULT NULL COMMENT '配置项类型id',
  `file_path` varchar(1000) DEFAULT NULL COMMENT '原始文件路径',
  `target_value` text COMMENT '目标值。类型是文件类型时，该值是文件存放地址',
  PRIMARY KEY (`id`),
  KEY `source_id` (`source_id`),
  KEY `version_id` (`version_id`),
  KEY `type_id` (`type_id`),
  CONSTRAINT `source_config_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `git_source` (`id`),
  CONSTRAINT `source_config_ibfk_2` FOREIGN KEY (`version_id`) REFERENCES `source_version` (`id`),
  CONSTRAINT `source_config_ibfk_3` FOREIGN KEY (`type_id`) REFERENCES `config_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for source_version
-- ----------------------------
DROP TABLE IF EXISTS `source_version`;
CREATE TABLE `source_version` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `source_id` varchar(50) DEFAULT NULL,
  `version` varchar(50) DEFAULT NULL COMMENT '版本号',
  `description` varchar(200) DEFAULT NULL COMMENT '版本描述信息',
  `publish_time` bigint DEFAULT NULL COMMENT '版本发布时间',
  `status` int DEFAULT NULL COMMENT '版本状态：0：废弃；1：正常；2: 归档',
  `readme_doc` text COMMENT 'readme说明文档',
  `build_doc` text COMMENT '部署文档',
  `update_doc` text COMMENT '更新文档',
  `compile_orders` text COMMENT '编译命令组。字符串数组json',
  `source_type` varchar(10) DEFAULT NULL COMMENT '版本来源类型：branch/tag/commit',
  `source_value` varchar(100) DEFAULT NULL COMMENT '版本来源值：branch/tag/commitId',
  `creator_id` varchar(50) DEFAULT NULL COMMENT '创建者id',
  `output_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '输出文件路径',
  PRIMARY KEY (`id`),
  KEY `source_id` (`source_id`),
  KEY `creator_id` (`creator_id`),
  CONSTRAINT `source_version_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `git_source` (`id`),
  CONSTRAINT `source_version_ibfk_2` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='gitSource版本';

-- ----------------------------
-- Table structure for sys
-- ----------------------------
DROP TABLE IF EXISTS `sys`;
CREATE TABLE `sys` (
  `git_token` varchar(100) DEFAULT NULL COMMENT 'git账号token，用于调用git的API',
  `git_account` varchar(100) DEFAULT NULL COMMENT 'git账号登录名',
  `inited` tinyint(1) DEFAULT NULL COMMENT '系统是否已初始化',
  `git_ssh` varchar(1000) DEFAULT NULL COMMENT 'git ssh keys',
  `git_host` varchar(100) DEFAULT NULL COMMENT 'git库host地址,用于API调用',
  `id` int(10) unsigned zerofill NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for template
-- ----------------------------
DROP TABLE IF EXISTS `template`;
CREATE TABLE `template` (
  `id` varchar(50) NOT NULL DEFAULT '' COMMENT '模板id',
  `name` varchar(100) DEFAULT NULL COMMENT '模板名称',
  `description` text CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '描述信息',
  `creator_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '创建人id',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `enable` int NOT NULL DEFAULT '1' COMMENT '禁用状态 0为禁用 1为启用',
  PRIMARY KEY (`id`),
  KEY `creator_id_user_id` (`creator_id`),
  CONSTRAINT `creator_id_user_id` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for template_config
-- ----------------------------
DROP TABLE IF EXISTS `template_config`;
CREATE TABLE `template_config` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `template_id` varchar(50) DEFAULT NULL COMMENT '模板id',
  `template_version_id` varchar(50) DEFAULT NULL COMMENT '模板版本id',
  `template_version_git_id` varchar(50) DEFAULT NULL COMMENT '模板版本中git项id',
  `git_source_config_id` varchar(50) DEFAULT NULL COMMENT '模板版本中git项的配置项id',
  `target_value` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '默认值',
  `is_hidden` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否隐藏',
  `global_config_id` varchar(50) DEFAULT NULL COMMENT '全局配置id',
  PRIMARY KEY (`id`),
  KEY `template_id` (`template_id`),
  KEY `template_version_id` (`template_version_id`),
  KEY `template_version_git_id` (`template_version_git_id`),
  KEY `git_source_config_id` (`git_source_config_id`),
  KEY `global_config_id` (`global_config_id`),
  CONSTRAINT `template_config_ibfk_5` FOREIGN KEY (`global_config_id`) REFERENCES `template_global_config` (`id`),
  CONSTRAINT `template_config_ibfk_6` FOREIGN KEY (`template_id`) REFERENCES `template` (`id`),
  CONSTRAINT `template_config_ibfk_7` FOREIGN KEY (`template_version_id`) REFERENCES `template_version` (`id`),
  CONSTRAINT `template_config_ibfk_8` FOREIGN KEY (`template_version_git_id`) REFERENCES `template_version_git` (`id`),
  CONSTRAINT `template_config_ibfk_9` FOREIGN KEY (`git_source_config_id`) REFERENCES `source_config` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='模板对应git源局部配置';

-- ----------------------------
-- Table structure for template_global_config
-- ----------------------------
DROP TABLE IF EXISTS `template_global_config`;
CREATE TABLE `template_global_config` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(50) DEFAULT NULL COMMENT '名称',
  `description` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '描述',
  `template_id` varchar(50) DEFAULT NULL COMMENT '模板id',
  `template_version_id` varchar(50) DEFAULT NULL COMMENT '模板版本id',
  `target_value` text CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '默认值',
  `is_hidden` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否隐藏配置项',
  `type` int DEFAULT NULL COMMENT '配置类型',
  PRIMARY KEY (`id`),
  KEY `template_version_id` (`template_version_id`),
  KEY `template_id` (`template_id`),
  CONSTRAINT `template_source_config_ibfk_1` FOREIGN KEY (`template_version_id`) REFERENCES `template_version` (`id`),
  CONSTRAINT `template_source_config_ibfk_2` FOREIGN KEY (`template_id`) REFERENCES `template` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='模板中全局配置信息';

-- ----------------------------
-- Table structure for template_version
-- ----------------------------
DROP TABLE IF EXISTS `template_version`;
CREATE TABLE `template_version` (
  `id` varchar(50) NOT NULL DEFAULT '' COMMENT '模板版本id',
  `template_id` varchar(50) DEFAULT NULL COMMENT '模板id',
  `description` varchar(200) DEFAULT NULL COMMENT '版本描述',
  `version` varchar(50) DEFAULT NULL COMMENT '模板版本号',
  `status` int NOT NULL DEFAULT '1' COMMENT '版本状态：0：废弃；1：正常；',
  `publish_time` timestamp NULL DEFAULT NULL COMMENT '版本发布时间',
  `readme_doc` text COMMENT '说明文档',
  `build_doc` text COMMENT '部署文档',
  `update_doc` text COMMENT '更新文档',
  PRIMARY KEY (`id`),
  KEY `template_id` (`template_id`),
  CONSTRAINT `template_version_ibfk_3` FOREIGN KEY (`template_id`) REFERENCES `template` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='模板版本';

-- ----------------------------
-- Table structure for template_version_git
-- ----------------------------
DROP TABLE IF EXISTS `template_version_git`;
CREATE TABLE `template_version_git` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `template_id` varchar(50) DEFAULT NULL COMMENT '模板id',
  `template_version_id` varchar(50) DEFAULT NULL COMMENT '模板版本id',
  `git_source_id` varchar(50) DEFAULT NULL COMMENT 'git源id',
  `git_source_version_id` varchar(50) DEFAULT NULL COMMENT 'git源版本id',
  PRIMARY KEY (`id`),
  KEY `template_id` (`template_id`),
  KEY `template_version_id` (`template_version_id`),
  KEY `git_source_id` (`git_source_id`),
  KEY `git_source_version_id` (`git_source_version_id`),
  CONSTRAINT `template_config_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `template` (`id`),
  CONSTRAINT `template_config_ibfk_2` FOREIGN KEY (`template_version_id`) REFERENCES `template_version` (`id`),
  CONSTRAINT `template_config_ibfk_3` FOREIGN KEY (`git_source_id`) REFERENCES `git_source` (`id`),
  CONSTRAINT `template_config_ibfk_4` FOREIGN KEY (`git_source_version_id`) REFERENCES `source_version` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='模板版本中git源';

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(50) DEFAULT NULL COMMENT '用户名',
  `password` varchar(50) DEFAULT NULL COMMENT '密码',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `user_id` varchar(50) DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

SET FOREIGN_KEY_CHECKS = 1;
