(ScaffoldPlus = registerScript({
    name: "ScaffoldPlus",
    version: "1.0.0",
    authors: ["spring67"]
})).import("SpringApiV2.lib")

ScaffoldPlus.registerModule({
    name: "ScaffoldPlus",
    category: "Fun",
    description: "",
    tag: "",
    settings: {
        SprintMode: Setting.list({
            name: "SprintMode",
            default: "None",
            values: [
                "None",
                "Vulcan",
                "VulcanKeepY",
                "Watchdog",
                "MatrixKeepY",
            ]
        }),
        TowerMode: Setting.list({
            name: "TowerMode",
            default: "None",
            values: [
                "None",
                "Vulcan",
                "VulcanFast",
                //"Moon",
                "UpdatedNCP",
            ]
        }),
    },
}, function(module) {
    var SprintMode = module.settings.SprintMode.get()
    var TowerMode = module.settings.TowerMode.get()

    var tick = 0
    var tick2 = 0
    var airTicks = 0
    var HurtTime = 101
    var testthing = 0
    var firstTime = true
    var wasFirstTime = true
    var oldPosY = plr.posY
    module.on("enable", function() {
        plr = mc.thePlayer
        tick = 0
        tick2 = 0
        HurtTime = 101
    })
    module.on("disable", function(){
        firstTime = true
        mc.thePlayer.stepHeight = 0.5;
    })

    module.on("update", function() {
        SprintMode = module.settings.SprintMode.get()
        TowerMode = module.settings.TowerMode.get()
        module.tag = SprintMode

        if (TowerMode == "Moon") {
            if (mc.gameSettings.keyBindJump.isKeyDown()) {
                if (IsMoving()) {
                    strafe(0.22)
                    plr.motionY = 0.18
                }else{
                    plr.motionY = 0.39
                }
            }
        }else if (TowerMode == "UpdatedNCP") {
            if (airTicks == 2) {
                plr.motionY = 0
                strafe(0.22)
            }
        }else if (TowerMode == "Vulcan") {
            if (IsMoving()) {
                if (airTicks == 2) plr.motionY = 0;
            }else{
                if (airTicks < 4 && airTicks != 0 && mc.gameSettings.keyBindJump.isKeyDown()) {
                    if (tick > 1) {
                        plr.motionY = 0.41999998688697815
                    }
                    strafe(0)
                }
                if (airTicks == 5) {plr.motionY = -0.1}
            }
        }else if (TowerMode == "VulcanFast") {
            if (mc.gameSettings.keyBindJump.isKeyDown()) {
                if (IsMoving()) {
                    if (airTicks == 2) plr.motionY = -0.1;
                }else{
                    if (airTicks > 0) {
                        if (tick > 1) {
                            plr.motionY = 0.41999998688697815
                            testthing = 0.1
                            tick = 0
                        }else{
                            testthing = -0.1
                        }
                    }
                    //plr.motionX = tick % 2 == 0 ? 0.1 : -0.1
                    strafe(0)
                }
            }
        }

        if (SprintMode == "Vulcan" && plr.onGround) {
            strafe(0.14)
        }else if (SprintMode == "VulcanKeepY" && IsMoving()) {
            if (plr.onGround) {
                plr.motionY = 0.41999998688697815
                strafe(plr.isPotionActive(1) && 0.75 || 0.47)
            }
            if (airTicks == 3) plr.motionY = -0.1;
        }else if (SprintMode == "Watchdog" && IsMoving()) {
            if (plr.onGround) {
                strafe(0.08)
            }
        }else if (SprintMode == "MatrixKeepY" && IsMoving()) {
            if (plr.onGround) {
                plr.jump()
                if (firstTime == true) strafe(0);
                firstTime = false
            }
            if (airTicks == 10 && wasFirstTime) {
                strafe(0)
                wasFirstTime = false
            }
        }

        if (plr.onGround) {airTicks = 0}else{airTicks ++}
        if (plr.hurtTime == 8) {HurtTime = 0}else{HurtTime++}
        tick++
        tick2++
    })

    module.on("packet", function(eventPacket) {
        var packet = eventPacket.getPacket()

        if (TowerMode == "VulcanFast" && !IsMoving() && airTicks > 0 && (packet instanceof C04PacketPlayerPosition || packet instanceof C06PacketPlayerPosLook)) {
            packet.x += testthing + Math.random() / 100
            //Chat.print(packet.x)
        }

        if (TowerMode == "Moon" && (packet instanceof C04PacketPlayerPosition || packet instanceof C06PacketPlayerPosLook)) {
            if (airTicks > 1) {
                //packet.y = oldPosY
            }
            oldPos = packet.y
        }
    })
})
