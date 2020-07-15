

DROP TABLE IF EXISTS `config_type`;

CREATE TABLE `config_type` (
  `id` int(11) NOT NULL,
  `label` varchar(100) DEFAULT NULL COMMENT '类型描述',
  `key` varchar(10) DEFAULT NULL COMMENT '英文标识',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文本、文件替换、json';


DROP TABLE IF EXISTS `git_source`;

CREATE TABLE `git_source` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(50) DEFAULT NULL COMMENT '源名称',
  `description` text COMMENT '库描述信息',
  `git` varchar(100) DEFAULT NULL COMMENT 'git地址',
  `enable` tinyint(1) DEFAULT NULL COMMENT '是否启用为源',
  `git_id` int(10) DEFAULT NULL COMMENT 'git库中的id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='git源\n会将当前git账号有权限的所有git库都导入进来';

DROP TABLE IF EXISTS `project`;

CREATE TABLE `project` (
  `id` varchar(50) NOT NULL DEFAULT '' COMMENT '工程id',
  `name` varchar(100) DEFAULT NULL COMMENT '配置名称',
  `template_id` varchar(50) DEFAULT NULL COMMENT '模板id',
  `template_version` varchar(50) DEFAULT NULL COMMENT '模板版本',
  `compile_type` int(2) DEFAULT NULL COMMENT '编译类型。0：私有部署；1：常规迭代；2：发布测试',
  `publish_type` int(2) DEFAULT NULL COMMENT '发布方式。0：发布到git；1：下载；2：自动',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='项目表。';

DROP TABLE IF EXISTS `project_global_config`;

CREATE TABLE `project_global_config` (
  `id` varchar(50) NOT NULL DEFAULT '' COMMENT '配置项id',
  `config_id` varchar(50) DEFAULT NULL,
  `project_id` varchar(50) DEFAULT NULL COMMENT '工程id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL COMMENT '角色名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `source_version`;

CREATE TABLE `source_version` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `source_id` varchar(50) DEFAULT NULL,
  `version` varchar(50) DEFAULT NULL COMMENT '版本号',
  `description` varchar(200) DEFAULT NULL COMMENT '版本描述信息',
  `publish_time` bigint(13) DEFAULT NULL COMMENT '版本发布时间',
  `status` int(2) DEFAULT NULL COMMENT '版本状态：0：废弃；1：正常；',
  `readme_doc` text COMMENT 'readme说明文档',
  `build_doc` text COMMENT '部署文档',
  `update_doc` text COMMENT '更新文档',
  `compile_orders` text COMMENT '编译命令组。字符串数组json',
  `source_type` varchar(10) DEFAULT NULL COMMENT '版本来源类型：branch/tag/commit',
  `source_value` varchar(100) DEFAULT NULL COMMENT '版本来源值：branch/tag/commitId',
  PRIMARY KEY (`id`),
  KEY `source_id` (`source_id`),
  CONSTRAINT `source_version_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `git_source` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='gitSource版本';

DROP TABLE IF EXISTS `source_config`;
CREATE TABLE `source_config` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `source_id` varchar(50) DEFAULT NULL COMMENT '源id',
  `version_id` varchar(50) DEFAULT NULL COMMENT '版本id',
  `desc` text COMMENT '配置项描述',
  `reg` varchar(200) DEFAULT NULL COMMENT '配置项正则',
  `type_id` int(11) DEFAULT NULL COMMENT '配置项类型id',
  `file_path` varchar(1000) DEFAULT NULL COMMENT '原始文件路径',
  `target_value` text COMMENT '目标值。类型是文件类型时，该值是文件存放地址',
  PRIMARY KEY (`id`),
  KEY `source_id` (`source_id`),
  KEY `version_id` (`version_id`),
  KEY `type_id` (`type_id`),
  CONSTRAINT `source_config_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `git_source` (`id`),
  CONSTRAINT `source_config_ibfk_2` FOREIGN KEY (`version_id`) REFERENCES `source_version` (`id`),
  CONSTRAINT `source_config_ibfk_3` FOREIGN KEY (`type_id`) REFERENCES `config_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `sys`;

CREATE TABLE `sys` (
  `git_token` varchar(100) DEFAULT NULL COMMENT 'git账号token，用于调用git的API',
  `git_account` varchar(100) DEFAULT NULL COMMENT 'git账号登录名',
  `inited` tinyint(1) DEFAULT NULL COMMENT '系统是否已初始化',
  `git_ssh` varchar(1000) DEFAULT NULL COMMENT 'git ssh keys',
  `git_host` varchar(100) DEFAULT NULL COMMENT 'git库host地址,用于API调用'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `template`;

CREATE TABLE `template` (
  `id` varchar(50) NOT NULL DEFAULT '' COMMENT '模板id',
  `name` varchar(100) DEFAULT NULL COMMENT '模板名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `template_version`;
CREATE TABLE `template_version` (
  `id` varchar(50) NOT NULL DEFAULT '' COMMENT '模板版本id',
  `sourse_id` varchar(50) DEFAULT NULL COMMENT 'git源id',
  `sourse_version` varchar(50) DEFAULT NULL COMMENT 'git源版本',
  `source_build_type` tinyint(1) DEFAULT NULL COMMENT 'git源发布方式。0：发布到git；1：下载',
  `version` varchar(50) DEFAULT NULL COMMENT '模板版本号',
  `status` int(2) DEFAULT NULL COMMENT '版本状态：0：废弃；1：正常；',
  `publish_time` timestamp NULL DEFAULT NULL COMMENT '版本发布时间',
  `readme_doc` text COMMENT '说明文档',
  `build_doc` text COMMENT '部署文档',
  `update_doc` text COMMENT '更新文档',
  PRIMARY KEY (`id`),
  KEY `sourse_id` (`sourse_id`),
  KEY `sourse_version` (`sourse_version`),
  CONSTRAINT `template_version_ibfk_1` FOREIGN KEY (`sourse_id`) REFERENCES `git_source` (`id`),
  CONSTRAINT `template_version_ibfk_2` FOREIGN KEY (`sourse_version`) REFERENCES `source_version` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='模板版本';

DROP TABLE IF EXISTS `template_config`;
CREATE TABLE `template_config` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `template_id` varchar(50) DEFAULT NULL COMMENT '模板id',
  `version_id` varchar(50) DEFAULT NULL COMMENT '模板版本',
  `name` varchar(100) DEFAULT NULL COMMENT '配置项名称',
  `file_path` varchar(1000) DEFAULT NULL COMMENT '原始文件路径',
  `type_id` int(11) DEFAULT NULL COMMENT '配置项类型',
  `value` text COMMENT '配置项默认值',
  `desc` text COMMENT '配置项描述',
  `reg` varchar(1000) DEFAULT NULL COMMENT '配置项正则表达式',
  `is_hidden` tinyint(1) DEFAULT NULL COMMENT '是否隐藏',
  PRIMARY KEY (`id`),
  KEY `template_id` (`template_id`),
  KEY `version_id` (`version_id`),
  KEY `type_id` (`type_id`),
  CONSTRAINT `template_config_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `template` (`id`),
  CONSTRAINT `template_config_ibfk_2` FOREIGN KEY (`version_id`) REFERENCES `template_version` (`id`),
  CONSTRAINT `template_config_ibfk_3` FOREIGN KEY (`type_id`) REFERENCES `config_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='模板全局配置';

DROP TABLE IF EXISTS `template_source_config`;

CREATE TABLE `template_source_config` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `source_id` varchar(50) DEFAULT NULL COMMENT 'git源id',
  `template_version_id` varchar(50) DEFAULT NULL COMMENT '模板版本id',
  `template_id` varchar(50) DEFAULT NULL COMMENT '模板id',
  `config_id` varchar(50) DEFAULT NULL COMMENT 'git源的配置项id',
  `default_value` text COMMENT '默认值',
  `enable` tinyint(1) DEFAULT NULL COMMENT '是否启用配置项',
  `is_hidden` tinyint(1) DEFAULT NULL COMMENT '是否隐藏配置项',
  PRIMARY KEY (`id`),
  KEY `source_id` (`source_id`),
  KEY `template_version_id` (`template_version_id`),
  KEY `template_id` (`template_id`),
  KEY `config_id` (`config_id`),
  CONSTRAINT `template_source_config_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `git_source` (`id`),
  CONSTRAINT `template_source_config_ibfk_2` FOREIGN KEY (`template_version_id`) REFERENCES `template_version` (`id`),
  CONSTRAINT `template_source_config_ibfk_3` FOREIGN KEY (`template_id`) REFERENCES `template` (`id`),
  CONSTRAINT `template_source_config_ibfk_4` FOREIGN KEY (`config_id`) REFERENCES `template_config` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='模板中，git源配置信息';

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(50) DEFAULT NULL COMMENT '用户名',
  `password` varchar(50) DEFAULT NULL COMMENT '密码',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_role`;

CREATE TABLE `user_role` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `user_id` varchar(50) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
