(BHop = registerScript({
    name: "BHop",
    version: "1.0.0",
    authors: ["spring67"]
})).import("SpringApiV2.lib")

BHop.registerModule({
    name: "BHop",
    category: "Fun",
    description: "",
    tag: "",
    settings: {
        Mode: Setting.list({
            name: "Mode",
            default: "Vanilla",
            values: [
                "Vanilla",
                "Moon",
                "Vulcan",
                "Verus",
                "UpdatedNCP",
                "VerusLow",
                "VulcanLow",
                "KarhuLow",
                "VulcanStrafe",
            ]
        }),
        Speed: Setting.float({
            name: "Speed",
            default: 0.3,
            min: 0.0,
            max: 2.0,
        }),
        FastFall: Setting.boolean({
            name: "FastFall",
            default: true,
        }),
    },
}, function(module) {
    var Mode = module.settings.Mode.get()

    var tick = 0
    var tick2 = 0
    var airTicks = 0
    var preAirTicks = 0
    var HurtTime = 101
    var testval = 0
    var UpOrDown = false
    var oldPosY = 0
    var oldPosX = 0
    var oldPosZ = 0
    var lastReportedY = plr.posY
    module.on("enable", function() {
        plr = mc.thePlayer
        tick = 0
        tick2 = 0
        HurtTime = 101
        oldPosY = plr.posY
    })
    module.on("disable", function(){
        timer.timerSpeed = 1
    })

    module.on("update", function() {
        Mode = module.settings.Mode.get()
        module.tag = Mode

        if (plr.hurtTime == 8) {HurtTime = 0}else{HurtTime++}
        if (plr.onGround) {preAirTicks = 0}else{preAirTicks ++}

        if (!IsMoving()) {
            return
        }

        if (Mode == "Vanilla") {
            if (plr.onGround) {
                plr.motionY = 0.41999998688697815
                strafe(0.47)
            }
            strafe(module.settings.Speed.get())
        }else if (Mode == "Vulcan") {
            if (plr.onGround) {
                plr.motionY = 0.41999998688697815
                strafe(plr.isPotionActive(1) && 0.75 || 0.48)
            }

            if (airTicks == 3) {
                plr.motionY = -0.17
            }
        }else if (Mode == "VulcanStrafe") {
            if (plr.onGround) {
                plr.motionY = 0.41999998688697815
                strafe(plr.isPotionActive(1) && 0.75 || 0.48)
            }
            if (airTicks == 4 && module.settings.FastFall.get()) plr.motionY = -0.2;
            if (airTicks > 4 && airTicks < 9) strafe(plr.isPotionActive(1) && 0.22 || 0.215);
        }else if (Mode == "VulcanLow") {
            if (plr.onGround) {
                plr.motionY = 0.41999998688697815
                strafe(0.4)
            }
            if (preAirTicks == 1) {
                plr.motionY = -0.1
            }
        }else if (Mode == "Verus") {
            if (plr.onGround) {
                plr.motionY = 0.41999998688697815
                strafe(plr.isPotionActive(1) && 0.6 || 0.47)
            }else{
                strafe(plr.isPotionActive(1) && 0.36 || 0.33)
            }
        }else if (Mode == "VerusLow") {
            if (plr.onGround) {
                plr.motionY = 0.41999998688697815
                strafe(plr.isPotionActive(1) && 0.6 || 0.48)
            }else{
                strafe(plr.isPotionActive(1) && 0.36 || 0.33)
            }
            if (preAirTicks == 1) {
                plr.motionY = -0.09800000190734864
            }
        }else if (Mode == "UpdatedNCP") {
            if (plr.onGround) {
                plr.motionY = 0.41999998688697815
                strafe(plr.isPotionActive(1) && 0.6 || 0.47)
                testval = 0.33
            }else{
                strafe(plr.isPotionActive(1) && testval + 0.1 || testval)
                if (testval > 0) {
                    testval -= 0.009
                }
                if (airTicks == 3 && module.settings.FastFall.get()) {
                    plr.motionY = -0.09800000190734864
                }
                if (HurtTime < 10) {
                    strafe(testval + 0.2)
                }
            }
        }else if (Mode == "KarhuLow") {
            if (plr.onGround) {
                plr.jump()
                UpOrDown = !UpOrDown
            }else{
                if (UpOrDown && airTicks == 1) {
                    plr.motionY -= 0.2
                }
            }
        }else if (Mode == "Moon") {
            if (IsMoving()) {
                if (plr.onGround) {
                    plr.motionY = 0.41999998688697815
                    strafe(plr.isPotionActive(1) && 0.6 || 0.47)
                    testval = 0.3
                }else{
                    if (testval > 0) {
                        testval -= 0.015
                    }
                    if (preAirTicks == 2) {
                        plr.motionY = -0.0784000015258789
                    }
                    if (tick > 1) {
                        tick = 0
                        //strafe(plr.isPotionActive(1) && testval + 0.1 || testval)
                    }
                }
            }
        }

        if (plr.onGround) {airTicks = 0}else{airTicks ++}
        tick++
        tick2++
    })

    var extra = 0
    module.on("packet", function(eventPacket) {
        var packet = eventPacket.getPacket()

        if (Mode == "Moon" && (packet instanceof C04PacketPlayerPosition || packet instanceof C06PacketPlayerPosLook) && airTicks > 1) {
            //packet.y = oldPosY
            //packet.onGround = true
        }
    })
})
